// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import CONST from '@/utils/CONST'
import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import iView from 'iview';
import 'iview/dist/styles/iview.css'; // 使用 CSS
import loginUtils from '@/utils/loginUtils'
import store from './store'
import { directives } from '@/utils/directives/index' // 全局自定义指令
import Interceptors from '@/http/axiosinterceptors'
import TreeTable from '@/components/Table/TreeTable'
import ramda from 'ramda'
//加载全局变量
CONST()
    //设置默认请求url
axios.defaults.baseURL = $BASE.URL
    //设置允许跨域设置
axios.defaults.withCredentials = true
    //初始化拦截器
Interceptors.init(axios, iView)
Vue.component('TreeTable', TreeTable)
    /*加载进Vue*/
Vue.use(VueAxios, axios)
    /*加载iView*/
Vue.use(iView);
Vue.config.productionTip = false
    /* 全局引用ramda库 */
Vue.prototype.$r = ramda

let staticMode = false // 静态页面模式

router.beforeEach((to, from, next) => {
    if (!staticMode) {
        if (from.path == '/' && to.path != '/Index' && to.path != '/Login') {
            if (!loginUtils.checkIsLogin()) {
                next('/Login')
            } else {
                next('/Index')
            }
        } else {
            iView.LoadingBar.start()
            next()
        }
    } else {
        next()
    }
});

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish()
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})