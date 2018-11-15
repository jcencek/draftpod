import Vue from 'vue'

import 'bootswatch/dist/slate/bootstrap.min.css'
import 'jquery/dist/jquery'
import 'bootstrap/dist/js/bootstrap.bundle'
import './styles/slate.css'

import router from './router'
import store from './store'

// TODO: card thumbnail for resume

// TODO: don't show recent if empty

// TODO: ability to remove recent drafts?

// TODO: implement separate piles for instants and sorceries in deck

// TODO: flicker when pack is loading

// TODO: initial draft ai

// TODO: prerendered

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h('router-view')
}).$mount('#app');
