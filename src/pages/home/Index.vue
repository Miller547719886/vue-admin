<template>
  <div>
    <!-- <i-circle :percent="80">
            <span class="demo-i-circle-inner"
                  style="font-size:24px">80%</span>
    </i-circle>
    <i-circle :percent="100"
              stroke-color="#5cb85c">
      <Icon type="ios-checkmark-empty"
            size="60"
            style="color:#5cb85c"></Icon>
    </i-circle>
    <i-circle :percent="35"
              stroke-color="#ff5500">
            <span class="demo-i-circle-inner">
                  <Icon type="ios-close-empty" size="50" style="color:#ff5500"></Icon>
            </span>
    </i-circle> -->
  </div>
</template>

<script>
  import router from '@/router'
  export default {
    name: 'Index',
    data() {
      return {
        num: 1,
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.clearTabsView()
      })
    },
    mounted() {
      // this.$http.get('/user/user/findByAccount?account=admin').then(({data}) => {
      //   // success callback
      //   console.log(data)
      // }, response => {
      //   // error callback
      //   console.log(response)
      // })
    },
    methods: {
      refresh () {
        this.$refs.pageTable.load({url: `/user/role/roleListByPage`})
      },
      /* 清空全局页面标签 */
      clearTabsView () {
        this.$store.dispatch('clearVisitedViews')
      }
    }
  }
</script>
