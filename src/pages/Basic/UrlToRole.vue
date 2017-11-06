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
      <h2>链接：</h2>
      <Tree :data="urls"
            show-checkbox
            @on-check-change="onUrlsChecked"></Tree>
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
    name: 'UrlToRole',
    data() {
      return {
        urls: [],
        roles: [],
        urlIds: [],
        roleIds: []
      }
    },
    created() {
      this.refresh()
    },
    methods: {
      refresh() {
        this.urls = []
        this.roles = []
        this.$http.get('/user/url/findAllExcludePermission').then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.urls = common.strToJson(data.data)
          }
        })
        this.$http.get(`/user/role/findAll`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.roles = data.data
          }
        })
      },
      onUrlsChecked(data) {
        let ids = []
        data.forEach(function (i) {
          ids.push(i.id)
        })
        this.urlIds = ids
      },
      onRolesChecked(data) {
        let ids = []
        data.forEach(function (i) {
          ids.push(i.id)
        })
        this.roleIds = ids
      },
      submit() {
        if (this.urlIds.length == 0) {
          this.$Notice.error({
            title: '警告提示',
            desc: `请选择链接`
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
            this.$http.put('/user/role/urlToRole', {
              urlIds: this.urlIds,
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
