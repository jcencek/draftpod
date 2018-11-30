import Vue from 'vue'

import '@/components/core/bootstrap.js'
import * as Sentry from '@sentry/browser';

import router from './router'
import { store } from './store'

// sideboard to deck drop target isn't big enough
// smarter arrangement of sideboard (use main colors)

// some cards seem to show up a lot! (test distribution)

// TODO: initial draft ai (use for card preview)
//
//   consider adding a synergy field for archtypes
//
//   http://www.deckedbuilder.com/ (easy entry and exports w/ multiverse-id)
//   https://deckbox.org/ (imports from deckedbuilder)
//
// penalty for multi-color in early picks
// divide draft ai logic into buckets
// draft ai tier applying bonus to matters (i.e. sideboard before unplayable)
// test color distribution of bots

// ability to specify/upload custom cardpools

// configure sentry in production mode
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://49f3775ddef847b6a96c84d63bdeb02b@sentry.io/1331583',
    integrations: [new Sentry.Integrations.Vue({ Vue })]
  });
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h('router-view')
}).$mount('#app');


