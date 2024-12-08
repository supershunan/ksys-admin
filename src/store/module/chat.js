export default {
  state: {
    ws: null,
    isConnected: false
  },

  mutations: {
    SET_WEBSOCKET (state, ws) {
      state.ws = ws
    },
    SET_CONNECTED (state, status) {
      state.isConnected = status
    }
  },

  actions: {
    initWebSocket ({ commit, state }) {
      // 如果已经存在连接，直接返回
      if (state.ws && state.isConnected) {
        return
      }

      const token = window.localStorage.getItem('token')
      const ws = new WebSocket(`wss://ksys.qfyingshi.cn/ws?token=${token}`)

      ws.onopen = () => {
        console.log('WebSocket连接已建立')
        commit('SET_CONNECTED', true)
      }

      ws.onclose = () => {
        console.log('WebSocket连接已关闭')
        commit('SET_CONNECTED', false)
        // 断线重连
        setTimeout(() => {
          this.dispatch('initWebSocket')
        }, 5000)
      }

      commit('SET_WEBSOCKET', ws)
    },

    closeWebSocket ({ commit, state }) {
      if (state.ws) {
        state.ws.close()
        commit('SET_WEBSOCKET', null)
        commit('SET_CONNECTED', false)
      }
    }
  },

  getters: {
    getWebSocket: state => state.ws
  }
}
