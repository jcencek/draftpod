
import Vue from 'vue'
import VueRouter from 'vue-router'

import HomePage from '../components/HomePage.vue'
import TablePage from '../components/draft/table/TablePage.vue'
import JoinPage from '../components/JoinPage.vue'
import NavigatorPage from '../components/navigator/NavigatorPage.vue'
import SimulatorPage from '../components/SimulatorPage.vue'
import GuidePage from '../components/guide/GuidePage.vue'
import NotFoundPage from '../components/NotFoundPage.vue'
import DraftNotFoundPage from '../components/draft/NotFoundPage.vue'

import { store, useDraftModule } from '../store'
import { SET_DRAFT, REMOVE_DRAFTS } from '../store/mutations'
import firestore from '../store/modules/draft/firestore'
import * as log from './log'
import progress from './progress'
import * as selectors from '../store/modules/draft/selectors'

Vue.use(VueRouter)

export default new VueRouter({

  mode: 'history',
  
  routes: [
    { path: '/', component: HomePage },
    { path: '/draft/', component: NavigatorPage },
    { path: '/draft/:draft_id/join', component: JoinPage, props: true,
      beforeEnter: (to, from, next) => {
        
        // alias ids
        let player_id = store.state.player.id;
        let draft_id = to.params.draft_id;

        // sync from firestore
        progress.start(350);
        firestore.getDraft(draft_id).then(draft => {

          if (draft) {
            // write locally
            store.commit(SET_DRAFT, { draft_id, draft });

            // bind draft module
            useDraftModule(draft_id, { preserveState: true });

            // if the draft is already started and we are in it then navigate to it (skip join)
            if (selectors.isStarted(draft.table) && selectors.hasPlayer(player_id, draft.table))
              next("/draft/" + draft_id);
            // otherwise continue to join ui
            else
              next();
          } else {
            draftNotFound(next, draft_id);
          }
        })
        .catch(error => {
          log.logException(error, "onGetDraftBeforeJoin");
          store.commit(REMOVE_DRAFTS, [draft_id]);
          draftNotFound(next, draft_id);
        })
        .finally(() => {
          progress.stop();
        });
      }
    },
    { path: '/draft/:draft_id/not-found', component: DraftNotFoundPage, props: true },
    { path: '/draft/:draft_id', component: TablePage, props: true, 
      beforeEnter: (to, from, next) => {
        
        // if the draft exists
        let draft_id = to.params.draft_id;
        if (draft_id in store.state.drafts) {

          // bind draft module
          useDraftModule(draft_id, { preserveState: true });

          // sync from firestore if this is a multi-player draft
          if (store.state.drafts[draft_id].options.multi_player) {

            progress.start(350);
            firestore.getDraft(draft_id).then(draft => {
              if (draft) {
                store.commit(SET_DRAFT, { draft_id, draft });
                next();
              } else {
                draftNotFound(next, draft_id);
              }
            })
            .catch(error => {
              log.logException(error, "onGetDraftBeforeDraft");
              draftNotFound(next, draft_id);
            })
            .finally(() => {
              progress.stop();
            });
           
          // single player draft, proceed without syncing
          } else {
            next();
          }

        // draft doesn't exist so navigate to the draft not found page
        } else {
          draftNotFound(next, draft_id);
        }
      } 
    },
    { path: '/guide/', component: GuidePage },
    { path: '/simulator/', component: SimulatorPage },
    { path: '*', component: NotFoundPage }
  ],
  
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
});


function draftNotFound(next, draft_id) {
  next("/draft/" + draft_id + "/not-found"); 
}

