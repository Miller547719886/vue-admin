/* 列表 */
import EngineerListSP from '@/pages/Engineer/EngineerList/EngineerListSP'
import EngineerListAC from '@/pages/Engineer/EngineerList/EngineerListAC'
/* 详情 */
import EngineerInfo from '@/pages/Engineer/EngineerInfo'
/* 新增 */
import addEngineer from '@/pages/Engineer/addEngineer'
/* 审核-资质 */
import CertificateAudit from '@/pages/Engineer/QualificationAudit/CertificateAudit'
import CertificateRecord from '@/pages/Engineer/QualificationAudit/CertificateRecord'
/* 审核-工程师 */
import PendingAudit from '@/pages/Engineer/EngineerAudit/PendingAudit'
import AuditRecord from '@/pages/Engineer/EngineerAudit/AuditRecord'

let engineer = [{
        path: '/Engineer/EngineerListSP',
        name: 'EngineerListSP',
        meta: {
            title: '工程师列表',
            breadcrumb: '工程师管理-服务商 / '
        },
        component: EngineerListSP
    },
    {
        path: '/Engineer/EngineerListAC',
        name: 'EngineerListAC',
        meta: {
            title: '工程师列表',
            breadcrumb: '工程师管理-区域中心 / '
        },
        component: EngineerListAC
    },
    {
        path: '/Engineer/EngineerInfo',
        name: 'EngineerInfo',
        meta: {
            title: '工程师详情',
            breadcrumb: '工程师管理 / '
        },
        component: EngineerInfo
    },
    {
        path: '/Engineer/CertificateAudit',
        name: 'CertificateAudit',
        meta: {
            title: '资质审核',
            breadcrumb: '工程师管理-区域中心 / '
        },
        component: CertificateAudit
    },
    {
        path: '/Engineer/CertificateRecord',
        name: 'CertificateRecord',
        meta: {
            title: '资质审核记录'
        },
        component: CertificateRecord
    },
    {
        path: '/Engineer/PendingAudit',
        name: 'PendingAudit',
        meta: {
            title: '工程师审核-待审核'
        },
        component: PendingAudit
    },
    {
        path: '/Engineer/AuditRecord',
        name: 'AuditRecord',
        meta: {
            title: '工程师审核-审核记录'
        },
        component: AuditRecord
    },
    {
        path: '/Engineer/addEngineer',
        name: 'addEngineer',
        meta: {
            title: '增加工程师'
        },
        component: addEngineer
    }
]

engineer.map((item) => {
    Object.assign(item.meta, {
        isTabView: true
    })
})

export default engineer