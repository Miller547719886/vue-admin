const batchOperate = {
  state: {
      message: false, // 是否需要改变返回的message
  },
  mutations: {
      SET_MESSAGE: (state, msg) => {
          state.message = msg
      }
  },
  actions: {
      setMessage({ commit }, msg) {
          commit('SET_MESSAGE', msg)
      }
  }
}

export default batchOperate
