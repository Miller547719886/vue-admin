<template>
  <div id="app">
    <Spin size="large"
          fix
          v-if="spin"
          class="login_loading_spin">
      <Icon type="load-c"
            size="18"
            class="login-spin-icon-load"></Icon>
      <div>{{text}}</div>
    </Spin>
    <!-- 全屏显示 -->
    <template v-if="Full">
      <keep-alive :include="keepAlive">
        <router-view></router-view>
      </keep-alive>
    </template>
    <!-- 布局显示 -->
    <Layout v-else>
      <keep-alive :include="keepAlive">
        <router-view></router-view>
      </keep-alive>
    </Layout>
  </div>
</template>

<script>
  import Layout from '@/components/Layout/Layout'
  export default {
    name: 'app',
    data() {
      return {
        Full: false,
        spin: false,
        text: ''
      }
    },
    components: {
      Layout
    },
    created() {
      let that = this
      common.addEvent('setFull', (param) => {
        that.Full = param
      })
      common.addEvent('setSpin', (param) => {
        that.spin = param.spin
        that.text = param.text
      })
      // let isFull = this.$route.name === 'EngineerInfo'
      // this.Full = !!isFull
    },
    computed: {
      keepAlive () {
        let tabsViewNameList = this.$store.state.views.tabsView.map((item) => {
          return item.name
        })
        return tabsViewNameList
      }
    }
  }
</script>

<style lang="scss">
  @import "styles/base";

  html,
  body,
  #app {
    height: 100%;
    background-color: #ececec;
    position: relative;
  }

  .ivu-loading-bar-inner-color-primary {
    background-color: white !important;
  }

  .ivu-loading-bar-inner-color-error {
    background-color: red !important;
  }

  .ivu-page {
    padding-top: 12px;
    float: right;
  }

  .tablePanel .ivu-btn-group {
    margin-bottom: 10px;
  }

  .text-green {
    color: green
  }

  .text-red {
    color: red
  }
</style>
