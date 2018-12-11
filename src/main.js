

import Vue from 'vue'
Vue.config.productionTip = false

import '@/components/core/bootstrap.js'

import * as Sentry from '@sentry/browser';

import firebase from 'firebase/app'
import 'firebase/auth'

import uuidv4 from 'uuid'
import router from './router'
import { store } from './store'
import { SET_PLAYER_ID } from './store/mutations'

// configure sentry in production mode
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://49f3775ddef847b6a96c84d63bdeb02b@sentry.io/1331583',
    integrations: [new Sentry.Integrations.Vue({ Vue })]
  });
}

// attempt to login to firebase
firebase.auth().signInAnonymously()
  .then(response => {
    initApp(response.user.uid);
  })
  .catch(() => {
    initApp();
  });

function initApp(firebase_uid) {

  // attempt to use the firebase uid, fallback to whatever user_id
  // we might have already stored, then finally to a new randomly generated id
  let player_id = firebase_uid || store.getters.player.id || uuidv4();

  // write the player id
  store.commit(SET_PLAYER_ID, player_id);

  // start the app
  new Vue({
    router,
    store,
    render: (h) => h('router-view')
  }).$mount('#app');  

}




// TODO: firebase:

//   - https://www.smashingmagazine.com/2018/04/vuejs-firebase-firestore/
//    (describes how to setup security)

//    Use onSnapshot to detect writes by other users

//   - https://vuejsdevelopers.com/2017/10/16/vue-js-firestore/



//   - https://medium.com/js-dojo/build-a-realtime-chat-app-with-vuejs-vuex-and-firestore-32d081668709
//   - https://medium.com/@amenallah.hsoumi/building-a-progressive-quiz-app-with-vue-vuex-and-firestore-part-1-ce73c7ba695d

// a library (but we should probably learn the low-level basics first):
//    - https://mesqueeb.github.io/vuex-easy-firestore/
// another library:
//    - https://github.com/fiery-data/fiery-vuex


 
// - sync the table to firestore

// - when writing / reading to firestore, "compress" the cards by just including
//   the multiverse id

// TODO: don't allow resetting pick timer in multi-user drafts?

// TODO: at larger deck sizes during building it's possible for a color
// to be auto-assigned 0 mana even though there is a card in that color
// (fraction is likely too small)

// TODO: add 404 handler

// TODO: favicon

// TODO: remove mana and set symbols?

// TODO: import Decked Builder YAML (.coll2)

// TODO: sideboard:
//    - automatic ordering?
//    - drop targets to deck not big enough
//    - trash/hide/second pile (pile which won't be in decklist) 




