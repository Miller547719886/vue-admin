import Menu from '@/pages/Basic/Menu'
import Role from '@/pages/Basic/Role'
import Account from '@/pages/Basic/Account'
import MenuToRole from '@/pages/Basic/MenuToRole'
import Url from '@/pages/Basic/Url'
import UrlToRole from '@/pages/Basic/UrlToRole'
import AreaCenter from '@/pages/Basic/AreaCenter/Index'
import MarketCompany from '@/pages/Basic/MarketCompany'
import Permission from '@/pages/Basic/Permission'
import AccountInfo from '@/pages/Basic/AccountInfo'

let basic = [{
        path: '/Basic/Menu',
        name: 'Menu',
        meta: {
            title: '菜单管理'
        },
        component: Menu
    }, {
        path: '/Basic/Role',
        name: 'Role',
        meta: {
            title: '角色管理'
        },
        component: Role
    }, {
        path: '/Basic/Account',
        name: 'Account',
        meta: {
            title: '用户管理'
        },
        component: Account
    }, {
        path: '/Basic/MenuToRole',
        name: 'MenuToRole',
        meta: {
            title: '菜单权限'
        },
        component: MenuToRole
    }, {
        path: '/Basic/Url',
        name: 'Url',
        meta: {
            title: '链接管理'
        },
        component: Url
    }, {
        path: '/Basic/UrlToRole',
        name: 'UrlToRole',
        meta: {
            title: '链接授权'
        },
        component: UrlToRole
    },
    {
        path: '/Basic/AreaCenter',
        name: 'AreaCenter',
        meta: {
            title: '区域中心'
        },
        component: AreaCenter
    },
    {
        path: '/Basic/MarketCompany',
        name: 'MarketCompany',
        meta: {
            title: '营销公司组织'
        },
        component: MarketCompany
    }, {
        path: '/Basic/Permission',
        name: 'Permission',
        meta: {
            title: '权限管理'
        },
        component: Permission
    }, {
        path: '/Basic/AccountInfo',
        name: 'AccountInfo',
        meta: {
            title: '账户信息'
        },
        component: AccountInfo
    }
]

basic.map((item) => {
    Object.assign(item.meta, {
        isTabView: true,
        breadcrumb: '系统设置 / 基础设置 / '
    })
})

export default basic