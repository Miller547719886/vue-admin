<template>
  <!-- 待审核列表 -->
  <div class="page-EngineerApplication">
    <div class="tablePanel">
      <div class="clearfix">
        <!-- 按钮组 -->
        <Button-group class="f-l">
          <Button @click="allPassButton">批量审核通过</Button>
          <Button @click="allRejectButton">批量拒绝</Button>
        </Button-group>
      </div>
      <!-- 角色列表 -->
      <Table @on-selection-change="selectionData" stripe :columns="formInfo" :data="roleListData"></Table>
      <!-- 分页 -->
      <div class="clearfix">
        <Page :total="total"
          :page-size="size"
          show-elevator
          show-sizer
          show-total
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"></Page>
      </div>
    </div>
    <!-- 是否审核/拒绝 弹窗 -->
  </div>
</template>

<script>
  export default {
    // 名称
    name: 'EngineerApplication',
    // 数据(初始/静态/待填充)
    data() {
      return {
        popUpIndex: 0,
        passOrRejectFlag: '',
        // 表单数据
        formInfo: [
          {
              type: 'selection',
              width: 100,
              align: 'center'
            },
            {
              type: 'index',
              width: 60,
              align: 'center',
              title: "编号"
            },
            {
              title: '状态',
              key: 'statusName',
              align: 'center'
            },
            {
              title: '员工号',
              key: 'accountCode',
              align: 'center'
            },
            {
            title: '工程师姓名',
            key: 'userName',
            align: 'center',
            className: 'ivu-table-info-column-engineerName',
            render: (h, {row, column, index}) => {
              console.log(row, 'row')
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      // window.open('#/Engineer/EngineerInfo?Eid=' + row.id)
                      this.$router.push({path: 'EngineerInfo', query: { Eid: row.id }})
                    }
                  }
                }, row.user.name)
              ]);
            }
          },
          {
            title: '手机号',
            key: 'userMobile',
            render: (h, {row, column, index}) => {
              let mobile = row.user.mobile
              return mobile
            },
            align: 'center'
          },
          {
            title: '服务星级',
            key: 'serviceLevel',
            align: 'center'
          },
          {
            title: '更新日期',
            key: 'updateTime',
            align: 'center',
            width: '100',
            render: (h, {row, column, index}) => {
              let cTime = row.createTime
              let uTime = row.updateTime
              return h('div', [
                  h('span', {}, uTime || cTime) // 若无更新时间就取创建时间
              ])
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {
                            type: 'text',
                            size: 'small'
                        },
                        style: {
                            marginRight: '5px'
                        },
                        on: {
                            click: () => {
                                this.passButton(params.index)
                            }
                        }
                    }, '通过申请'),
                    h('Button', {
                        props: {
                            type: 'text',
                            size: 'small'
                        },
                        on: {
                            click: () => {
                                this.rejectButton(params.index)
                            }
                        }
                    }, '拒绝')
                ]);
            }
          }
        ],
        roleListData: [],
        organizationIds: [],
        ids: [],
        page: 1,
        size: 10,
        total: 0,
      }
    },
    // 钩子(创建执行)
    /* beforeRouteEnter (to, from, text) {
      text(vm => {
         vm.organizationIds = loginUtils.getUserInfo().organizationIds
         console.log(1511)
         vm.getEngineerList()
      })
    }, */
    mounted () {
      this.getEngineerList()
    },
    // 方法
    methods: {
      pageChange(page) {
        this.page = page;
        this.getEngineerList()
      },
      /* 改变页面容量，重新加载 */
      pageSizeChange(size) {
        this.size = size
        this.getEngineerList()
      },
      getEngineerList () {
        this.organizationIds = loginUtils.getUserInfo().organizationIds
        let newPage = common.analysisPage(this.page)
        let url = `user/engineer/findEngineerListByQuery`
        let params = `?auditStatus=WAITTING&page=${newPage}&size=${this.size}`
        if (this.organizationIds) {
          for (let item of this.organizationIds) {
            params += ('&organizationIds=' + item)
          }
        }
        this.$http.get(url + params).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.roleListData = data.data.content
            console.log(this.roleListData, '12123123')
          }
        })
      },
      selectionData (currentRow, oldCurrentRow) {
        // 勾选项
        if (currentRow.length !== 0) {
          this.ids = []
          for (let value of currentRow) {
            this.ids.push(value.id)
          }
        } else {
          this.ids = []
        }
      },
      postRequest (type) {
        this.$http.post(`/user/engineer/auditPassOrReject?auditStatus=${type}`, this.ids).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            if (!this.passOrRejectFlag) {
              this.roleListData.splice(this.popUpIndex, 1);
            }
            this.$Notice.success({
              title: '成功提示',
              desc: `审核成功`
            })
            //刷新
            this.getEngineerList()
            this.ids = []
          }
        })
      },
      allPassButton () {
        // 批量审核通过
        this.passOrRejectFlag = true
        if (this.ids.length !== 0) {
          this.postRequest('PASS')
        } else {
          this.$Notice.warning({
            title: '警告提示',
            desc: '请勾选！'
          })
        }
      },
      allRejectButton () {
        // 批量拒绝通过
        this.passOrRejectFlag = false
        if (this.ids.length !== 0) {
          this.postRequest('REJECT')
        } else {
          this.$Notice.warning({
            title: '警告提示',
            desc: '请勾选！'
          })
        }
      },
      passButton (index) {
        // 审核通过
          this.passOrRejectFlag = true
          this.popUpIndex = parseInt(index)
          this.ids = []
          this.ids.push(this.roleListData[this.popUpIndex].id)
          this.postRequest('PASS')
      },
      rejectButton (index) {
        // 拒绝通过
          // this.data1.splice(index, 1);
          this.modalFlag = true
          this.passOrRejectFlag = false
          this.popUpIndex = parseInt(index)
           this.ids = []
          this.ids.push(this.roleListData[this.popUpIndex].id)
          this.postRequest('REJECT')
      }
      // show (index) {
      //   this.$Modal.info({
      //     title: '用户信息',
      //     content: `姓名：${this.data6[index].name}<br>年龄：${this.data6[index].age}<br>地址：${this.data6[index].address}`
      //   })
      // }
    },
    computed: {
    },
    watch: {
    }
  }
</script>
<style>
  .ivu-table-info-column-engineerName{
    color: #019dd9;
    text-decoration: underline;
    cursor: pointer;
  }
</style>

