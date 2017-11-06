<style scoped>
  .userinfo {
    float: right;
  }

  .userinfo:after {
    content: none !important;
  }

  .userinfo {
    background: #3772E7;
  }

  .userinfo .ivu-menu-submenu,
  .userinfo .headerMenuItem,
  .userinfo .ivu-menu-submenu:hover,
  .userinfo .headerMenuItem:hover {
    color: #FFF !important;
  }

  .userinfo .ivu-menu-submenu:hover,
  .userinfo .headerMenuItem:hover {
    background: #367FAA;
    border-bottom: #367FAA 2px !important;
  }
</style>
<template>
  <div>
    <Menu mode="horizontal"
          class="userinfo">
      <Menu-item class="headerMenuItem"
                 @click="home">
        <Icon type="ios-home"></Icon>
        首页
      </Menu-item>
      <Submenu v-if="!isAdmin" name="organization">
        <template slot="title">
          <Icon type="person-stalker"></Icon>
          {{currentOrganization && organization.name}}
        </template>
        <Menu-item v-for="organization in user.nameList"
          :key="organization.id"
          @click="selectOrganization(organization)">{{ organization.name }}</Menu-item>
      </Submenu>
      <Menu-item class="headerMenuItem">
        <Icon type="person"></Icon>
        {{user && user.name}}
      </Menu-item>
      <Menu-item class="headerMenuItem"
                 @click="logout">
        <Icon type="android-exit" size="16"></Icon>
        注销
      </Menu-item>

      <!-- <Submenu name="user">
        <template slot="title">
          <Icon type="person"></Icon>
          {{user && user.name}}
        </template>
        <Menu-item @click="setting">个人设置</Menu-item>
        <Menu-item @click="logout">登出</Menu-item>
      </Submenu> -->
    </Menu>
  </div>
</template>

<script>
  import MenuItem from './TopMenuItem'
  import router from '@/router'
  export default {
    name: 'TopHeader',
    components: {
      'Menu-item': MenuItem
    },
    data() {
      return {
        organization: {}
      }
    },
    props: {
      user: {
        type: Object,
        required: true,
        default: () => {
          return {}
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        console.log(vm.user, 'xxx')
      })
    },
    methods: {
      selectOrganization (organization) {
        // 点击当前组织无效
        if (organization.id === this.user.organizationId) {
          return
        } else if (organization.type === this.user.organizationType) {
          // 点击同类型组织不刷新页面
          this.organization.name = organization.name
          organization.id ?
          this.user.organizationId = organization.id : ''
          this.user.organizationName = organization.name
          loginUtils.setUserInfo(user)
          return
        }
        this.setLocalInfo(this.user, organization)
        /* this.organization.name = organization.name
        let userInfo = loginUtils.getUserInfo()
        userInfo.nameList.forEach((item, index) => {
          if (item.id === organization.id) {
            this.user.organizationType = userInfo.nameList[index].type
          }
        })
        this.user.organizationIds = userInfo[organization.type][0] ?
                                    userInfo[organization.type][0].organizationIds : ''
        this.user.organizationId = organization.id
        this.user.organizationName = organization.name
        // this.user.isSwitchOrganization = true // 切换服务商更换左侧菜单请求
        loginUtils.setUserInfo(this.user) */
        this.$router.go('/#/Index')
      },
      setLocalInfo (user, organization) {
        delete user.organizationIds
        delete user.organizationId
        this.organization.name = organization.name
        let userInfo = loginUtils.getUserInfo()
        userInfo.nameList.forEach((item, index) => {
          if (item.id === organization.id) {
            user.organizationType = userInfo.nameList[index].type
          }
        })
        if (userInfo[organization.type][0] && userInfo[organization.type][0].organizationIds) {
          user.organizationIds = userInfo[organization.type][0].organizationIds
        }
        organization.id ?
        user.organizationId = organization.id : ''
        user.organizationName = organization.name
        // this.user.isSwitchOrganization = true // 切换服务商更换左侧菜单请求
        loginUtils.setUserInfo(user)
      },
      home() {
        let active = document.querySelector('.layout-menu-left li.ivu-menu-item-active.ivu-menu-item-selected')
        console.log(active, 'active')
        if (active) {
          let mname = active.getAttribute('mname')
          this.$nextTick(function () {
            common.sendEvent('on-update-active-name', mname)
          })
        }
        common.sendEvent('link-change', ['首页'])
        router.push({path: "/Index"})
      },
      setting() {
        alert("setting")
      },
      logout() {
        common.sendEvent('setSpin', {spin: true, text: '正在登出中...'})
        this.$http.get('/user/logout').then(response => {
          logout()
        }, response => {
          logout()
        })
        let logout = () => {
          this.$Notice.success({
            title: '成功提示',
            desc: '登出成功'
          })
          common.sendEvent('setSpin', {spin: false})
          loginUtils.logout()
          router.push({
            name: 'Login'
          })
        }
      }
    },
    computed: {
      currentOrganization () {
        if (!this.user) {
          return
        }
        this.organization = {
          name: this.user.organizationName
        }
        return this.organization
      },
      isAdmin () {
        // console.log(this.user, 7777)
        if (this.user.nameList) {
          return false
        } else {
          return true
        }
      }
    }
  }
</script>
