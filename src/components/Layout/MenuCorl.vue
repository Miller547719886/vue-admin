<template>
  <div>
    <template v-if="isFirst">
      <CusMenu v-for="item in menus"
               key="item.id"
               :name="item.id">
        <template slot="title">
          <Icon v-if="item.icon && item.icon != ''"
                :type="item.icon"></Icon>
          {{item.name}}
        </template>
        <template v-for="child in item.children">
          <Menu-item v-if="child.children == null || child.children.length==0"
                     :name="child.id"
                     :mbx="[item.name,child.name]"
                     :link="child.link">
            {{child.name}}
          </Menu-item>
          <MenuCorl v-else
                    :menus="child"
                    :isFirst="false"
                    :mbx="[item.name,child.name]"></MenuCorl>
        </template>
      </CusMenu>
    </template>
    <template v-else>
      <CusMenu :name="menus.id">
        <template slot="title">
          <Icon v-if="menus.icon && menus.icon != ''"
                :type="menus.icon"></Icon>
          {{menus.name}}
        </template>
        <template v-for="child in menus.children">
          <Menu-item v-if="child.children == null || child.children.length==0"
                     :name="child.id"
                     :mbx="compMbx(child.name)"
                     :link="child.link">
            {{child.name}}
          </Menu-item>
          <MenuCorl v-else
                    :menus="child"
                    :isFirst="false"
                    :mbx="compMbx(child.name)"></MenuCorl>
        </template>
      </CusMenu>
    </template>
  </div>
</template>
<script>
  import CusMenu from './CusMenu'
  import MenuItem from './MenuItem'
  export default {
    name: 'MenuCorl',
    props: {
      menus: {},
      mbx: {},
      isFirst: {
        type: Boolean,
        default: true
      }
    },
    components: {
      CusMenu, 'Menu-item': MenuItem
    },
    methods: {
      compMbx(name) {
        let mbx = this.mbx.slice(0);
        mbx.push(name)
        return mbx;
      }
    }
  }
</script>
