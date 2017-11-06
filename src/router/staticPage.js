// 静态页面路由
import Engineers from '@/pages/staticPage/Engineers'
import ViewEngineerInformation from '@/pages/staticPage/ViewEngineerInformation'

export default [{
    path: '/staticPage/Engineers',
    name: 'Engineers',
    component: Engineers
}, {
    path: '/staticPage/ViewEngineerInformation',
    name: 'ViewEngineerInformation',
    component: ViewEngineerInformation
}]
