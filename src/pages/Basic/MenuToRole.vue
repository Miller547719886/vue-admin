<template>
  <div class="tablePanel">
    <Button-group>
      <Button icon="checkmark"
              @click="submit">提交
      </Button>
      <Button icon="android-refresh"
              @click="refresh">刷新
      </Button>
    </Button-group>
    <Row>
      <Col span="12">
      <h2>菜单：</h2>
      <Tree :data="menus"
            show-checkbox
            @on-check-change="onMenusChecked"></Tree>
      </Col>
      <Col span="12">
      <h2>角色：</h2>
      <Tree :data="roles"
            show-checkbox
            @on-check-change="onRolesChecked"></Tree>
      </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    name: 'MenuToRole',
    data() {
      return {
        menus: [],
        roles: [],
        menuIds: [],
        roleIds: []
      }
    },
    created() {
      this.refresh()
    },
    methods: {
      refresh() {
        this.menus = []
        this.roles = []
        this.$http.get('/user/menu/findAllExcludePermission').then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.menus = common.strToJson(data.data)
          }
        })
        this.$http.get(`/user/role/findAll`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.roles = data.data
          }
        })
      },
      onMenusChecked(data) {
        let ids = []
        data.forEach(function (i) {
          ids.push(i.id)
        })
        this.menuIds = ids
      },
      onRolesChecked(data) {
        let ids = []
        data.forEach(function (i) {
          ids.push(i.id)
        })
        this.roleIds = ids
      },
      submit() {
        if (this.menuIds.length == 0) {
          this.$Notice.error({
            title: '警告提示',
            desc: `请选择菜单`
          })
          return
        }
        if (this.roleIds.length == 0) {
          this.$Notice.error({
            title: '警告提示',
            desc: `请选择角色`
          })
          return
        }
        this.$Modal.confirm({
          title: '确认提示',
          content: '确认要授权吗？',
          loading: true,
          onOk: () => {
            this.$http.put('/user/role/menuToRole', {
              menuIds: this.menuIds,
              roleIds: this.roleIds
            }).then(({data}) => {
              if (data.code == $HTTP.SUCCESS) {
                this.refresh()
                this.$Modal.remove()
                this.$Notice.success({
                  title: '成功提示',
                  desc: `授权成功`
                })
              }
            })
          }
        })
      }
    }
  }
</script>
