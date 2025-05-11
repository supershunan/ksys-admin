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
    initWebSocket ({ state, commit, dispatch }) {
      // 如果已经存在连接，先关闭旧连接
      if (state.ws) {
        state.ws.close()
        commit('SET_WEBSOCKET', null)
      }

      const token = window.localStorage.getItem('token')
      const ws = new WebSocket(`https://kzt.ciyuansj.com/ws?token=${token}`)

      ws.onopen = () => {
        console.log('WebSocket连接已建立')
        commit('SET_CONNECTED', true)
      }

      ws.onclose = () => {
        console.log('WebSocket连接已关闭')
        commit('SET_CONNECTED', false)
        // 断线重连
        setTimeout(() => {
          console.log('执行重连...')
          dispatch('initWebSocket')
        }, 5000)
      }

      ws.onerror = (error) => {
        console.error('WebSocket发生错误:', error)
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
