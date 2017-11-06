/* 布局 */
<style>
  .layout {
    background: #f5f7f9;
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
  }

  .layout-breadcrumb {
    padding: 46px 15px 0 250px;
    line-height: 28px;
  }

  .layout-tabs-view {
    overflow: hidden;
    width: 1670px;
    padding: 10px 10px 0 0;
    margin-left: 250px;
    height: 46px;
    position: fixed;
    top: 60px;
    z-index:1;
  }

  .layout-content {
    border-radius: 4px;
    height: 100%;
    width: 100%;
    transition: all 0.2s ease;
    left: 0;
    top: 0;
    position: fixed;
    padding-left: 240px;
    padding-top: 135px;
    padding-bottom: 40px;
  }

  .layout-content-main {
    min-width: 1000px;
    padding: 10px;
    background-color: #FFF;
    height: 100%;
    overflow: auto;
    margin: 0 10px 0 10px;
  }

  .layout-copy {
    padding: 12px 10px 12px;
    color: #9ea7b4;
    position: fixed;
    width: 100%;
    bottom: 0;
  }

  .layout-menu-left {
    background: #464c5b;
    width: 240px !important;
    z-index: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: 60px;
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
  }

  ::-webkit-scrollbar {
    width: 5px;
    height: 16px;
    /*background-color: #2db7f5;*/
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    background-color: #39f;
  }

  .layout-content-right {
    width: 100% !important;
    position: fixed !important;
    top: 0;
    left: 0;
    z-index: 0;
  }

  .layout-header {
    height: 60px;
    background: #3772E7;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  }

  .layout-logo-left {
    position: fixed;
    top: 0;
    left: 0;
    width: 240px;
    height: 60px;
    background: #4065D9;
    color: #FFF;
    text-align: center;
    line-height: 60px;
    z-index: 2;
  }

  .ivu-menu-submenu .ivu-menu-submenu {
    margin-left: 19px
  }

  .ivu-menu-item {
    transition: none !important;
    -webkit-transform: none !important;
  }
</style>

<template>
  <div class="layout">
    <div class="layout-content-right">
      <div class="layout-header">
        <TopHeader :user="user"></TopHeader>
      </div>
      <div class="layout-tabs-view">
        <TabsView></TabsView>
      </div>
      <div class="layout-breadcrumb">
        <Breadcrumb>
          <Breadcrumb-item v-for="item in mbx"
                           :key="item">{{item}}
            <span slot="separator">/</span>
          </Breadcrumb-item>
        </Breadcrumb>
      </div>
      <div class="layout-content">
        <div class="layout-menu-left">
          <LeftMenu :menus="menus"></LeftMenu>
        </div>
        <div class="layout-content-main">
          <slot></slot>
        </div>
        <div class="layout-copy">
          2017 &copy; ISR
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import LeftMenu from './LeftMenu'
  import TopHeader from './TopHeader'
  import TabsView from './TabsView'
  import router from '@/router';
  export default {
    name: 'Layout',
    components: {
      LeftMenu,
      TopHeader,
      TabsView
    },
    data() {
      return {
        menus: [],
        mbx: ['首页'],
        user: loginUtils.getUserInfo()
      }
    },
    created() {
      let that = this
      //判断是否登录
      let b = loginUtils.checkIsLogin()
      if (!b) {
        //未登录 跳转登录
        router.replace({path: "/Login"})
        return;
      }
      //初始化
      // common.sendEvent('setSpin', {spin: true, text: '正在初始化中...'})
      //获取菜单(未登录->登录)
      let userInfo = loginUtils.getUserInfo()
      if (userInfo.nameList) {
        let type = userInfo.organizationType
        that.menus = userInfo[type]
        common.sendEvent('setSpin', {spin: false})
        return
      }
      let url = `/user/menus`

      // let url = loginUtils.getUserInfo().isSwitchOrganization
      //   ? `/user/resource/findResourceByUserAndOrganization?userId=${loginUtils.getUserInfo().id}&organizationId=${loginUtils.getUserInfo().organizationId}`
      //   : `/user/menus`
      this.$http.get(url).then(({data}) => {
        if (data.code == $HTTP.SUCCESS) {
          // 菜单保存到本地
          if (data.data.nameList) {
            if (data.data.nameList.length === 0) {
              that.menus = []
              common.sendEvent('setSpin', {spin: false})
              return
            }
            let _data = {}
            // 以下 操作同一对象
            _data = data.data
            let organizationType = data.data.nameList[0].type
            _data.organizationType = organizationType

            _data.organizationId = data.data.nameList[0].id
            _data.organizationIds = data.data[organizationType][0].organizationIds
            // 系统管理员 和 自建服务商  删除“新增工程师”。 系统管理员 手动增加名字
            data.data.nameList.forEach((item, index) => {
              if (item.type === 'SYSTEM') {
                _data.organizationId = null
                _data.organizationIds = null
                item.name = '系统管理员'
                this.delAddEngineer(_data[item.type])
              }
              if (item.type === 'SERVICE' && this.isSelf(item.id)) {
                item.self = true
                this.delAddEngineer(_data[item.type])
              }
            })

            _data.organizationName = data.data.nameList[0].name
            if (organizationType === 'SYSTEM') { // nameList第一个是系统管理员 手动增加名字
              _data.organizationName = '系统管理员'
            } else if (this.isSelf(_data.organizationId)) { // nameList第一个是自建服务商
              // 标记是自建
              _data.self = true
            }
            that.menus = _data[organizationType]


            data.data[organizationType][0] ?
            data.organizationIds = data.data[organizationType][0].organizationIds : ''
            // 保存本地
            let st = common.getStorage('USER_KEY')
            st = Object.assign(st, _data)
            common.setStorage('USER_KEY', st)
            // loginUtils.setUserInfo(_data)
            this.user = _data
          } else {
            // admin登录
            this.delAddEngineer(data.data.ADMIN)
            this.menus = data.data.ADMIN
          }
          common.sendEvent('setSpin', {spin: false})
        }
      }, response => {
        common.sendEvent('setSpin', {spin: false})
      })
      //监听面包屑改变
      common.addEvent('link-change', (mbx) => {
        that.mbx = mbx
      })
    },
    methods: {
      delAddEngineer (arr) {
        // 找到菜单栏“新增工程师”父节点
        arr.forEach((item, index) => {
          if (item.name === '工程师管理') {
            let i = index
            // 删除菜单栏“新增工程师”
            arr[i].children.forEach((item1, index1) => {
              if (item1.name === '新增工程师') {
                arr[i].children.splice(index1, 1)
              }
            })
          }
        })
        // this.menus = arr
      },
      isSelf (id) {
        let flag = false
        this.$http.get(`/user/organization/findOrganizationById?id=${id}`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            if (data.data.self === 2) {
              flag = true
            } else {
              flag = false
            }
          }
        })
        return flag
      }
    },
    computed: {
      visitedViews() {
        return this.$store.state.views.visitedViews.slice(-6)
      }
    },
  }
</script>

