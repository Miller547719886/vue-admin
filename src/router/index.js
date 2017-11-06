import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/pages/notfound/NotFound'
import Index from '@/pages/home/Index'
import Login from '@/pages/user/Login'
import Basic from './Basic'
import report from './report'
import staticPage from './staticPage'
import Engineer from './Engineer'
import formManage from './formManage'
Vue.use(Router)
    //基础路由
const routes = [{
    path: '/Index',
    name: 'Index',
    meta: {
        title: '首页'
    },
    component: Index
}, {
    path: '/Login',
    name: 'Login',
    meta: {
        title: '登录'
    },
    component: Login
}, {
    path: '/',
    redirect: '/Index',
}];

routes.map((item) => {
    if (item.meta) {
        Object.assign(item.meta, {
            isTabView: false
        })
    }
})

routes.push(...Basic)
routes.push(...report)
routes.push(...Engineer)
routes.push(...staticPage)
routes.push(...formManage)

//把通用匹配至于最后
routes.push({
    path: '*',
    component: NotFound
})
export default new Router({
    // mode: 'history',
    routes
})
