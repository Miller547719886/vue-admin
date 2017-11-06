import FineReport from '@/pages/report/FineReport'

let report = [{
    path: '/report/FineReport',
    name: 'FineReport',
    meta: {
        title: '报表'
    },
    component: FineReport
}]

report.map((item) => {
    Object.assign(item.meta, {
        isTabView: true,
        breadcrumb: ''
    })
})

export default report