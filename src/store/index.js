import Vue from 'vue'
import Vuex from 'vuex'
import views from './modules/views' // 视图状态
import batchOperate from './modules/batchOperate' // 批量操作 - 返回显示
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        views,
        batchOperate
    },
    getters
})

export default store
