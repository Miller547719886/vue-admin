const views = {
    state: {
        // sidebar: {
        //     opened: !+Cookies.get('sidebarStatus')
        // },
        visitedViews: [], // 浏览过的页面总数
        tabsView: [] // 被缓存并陈列在tabsView组件的页面
    },
    mutations: {
        // TOGGLE_SIDEBAR: state => {
        //     if (state.sidebar.opened) {
        //         Cookies.set('sidebarStatus', 1)
        //     } else {
        //         Cookies.set('sidebarStatus', 0)
        //     }
        //     state.sidebar.opened = !state.sidebar.opened
        // },
        CLEAR_VISITED_VIEWS: (state) => {
            state.visitedViews = []
            state.tabsView = []
        },
        ADD_VISITED_VIEWS: (state, view) => {
            if (state.visitedViews.some(v => v.path === view.path)) return
            state.visitedViews.push({
                name: view.name,
                path: view.path,
                meta: view.meta,
                query: view.query
            })
        },
        DEL_VISITED_VIEWS: (state, view) => {
            let index
            for (const [i, v] of state.visitedViews.entries()) {
                if (v.path === view.path) {
                    index = i
                    break
                }
            }
            state.visitedViews.splice(index, 1)
        },
        SET_TABS_VIEW: (state, viewList) => {
            state.tabsView = viewList
        }
    },
    actions: {
        ToggleSideBar({ commit }) {
            commit('TOGGLE_SIDEBAR')
        },
        addVisitedViews({ commit }, view) {
            commit('ADD_VISITED_VIEWS', view)
        },
        delVisitedViews({ commit, state }, view) {
            return new Promise((resolve) => {
                commit('DEL_VISITED_VIEWS', view)
                resolve([...state.visitedViews])
            })
        },
        clearVisitedViews({ commit, state }) {
            commit('CLEAR_VISITED_VIEWS')
        },
        setTabsView({ commit }, viewList) {
            commit('SET_TABS_VIEW', viewList)
        }
    }
}

export default views