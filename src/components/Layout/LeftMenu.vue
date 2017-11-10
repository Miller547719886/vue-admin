/* 左侧边菜单栏 */
<template>
  <Menu class="ivu-menu-isr" :active-name="$route.path">
    <div class="layout-logo-left">
      <h3>ISR后台管理系统</h3>
    </div>
    <MenuCorl :menus="menus"></MenuCorl>
  </Menu>
</template>

<script>
  import MenuCorl from './MenuCorl'
  export default {
    name: 'LeftMenu',
    props: {
      menus: {
        type: Array,
        required: true
      }
    },
    components: {
      MenuCorl
    }
  }
</script>


