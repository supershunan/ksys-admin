import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import websocket from './module/chat.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    app,
    websocket
  }
})
