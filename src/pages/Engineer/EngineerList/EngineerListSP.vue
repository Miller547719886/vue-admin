<template>
<!-- 工程师列表-服务商 -->
  <div class="page-engineer">
    <div class="tablePanel">
      <div class="clearfix">
        <!-- 按钮组 -->
        <Button-group class="f-l">
          <Button v-if="isSystemOrSelf" @click="addEngineer">新增工程师</Button>
          <Button @click="updateEngineerBatch">批量信息审核</Button>
          <Button @click="batchWork">批量上岗</Button>
          <Button @click="batchHang">批量挂起</Button>
          <Button @click="batchFrozen">批量冻结</Button>
          <Button @click="batchLeave">批量离岗</Button>
          <Button @click="updateIsDelBatch">批量删除</Button>
        </Button-group>

      </div>


      <div class="page-engineer-queryFrame">
        <!-- 星级下拉 -->
        <!-- <div class="f-r flex align-center ml-5">
          服务星级：
          <Select v-model="selectServiceLevel" @on-change="selectChange" :label-in-value="true"	style="width:200px">
            <Option v-for="item in selectListServiceLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div> -->
        <!-- 状态下拉 -->
        <div style="display: inline-block">
          状态：
          <Select v-model="selectStatus" @on-change="selectChange" :label-in-value="true"	style="width:200px">
            <Option v-for="item in selectListStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="in-block">
          员工号：
          <Input v-model="accountCode" placeholder="请输入..." style="width: 198px"></Input>
        </div>
        <div class="in-block">
          工程师姓名：
          <Input v-model="engineerName" placeholder="请输入..." style="width: 198px"></Input>
        </div>
        <div class="in-block">
          手机号：
          <Input v-model="telephone" placeholder="请输入..." style="width: 198px"></Input>
        </div>
        <div class="f-r flex align-center ml-5 in-block">
          <Button @click="Eliminate">清空</Button>
        </div>
        <div class="f-r flex align-center ml-5 in-block">
          <Button @click="lookup">查询</Button>
        </div>
        <!-- 服务商下拉 -->
        <!-- <div class="f-r flex align-center ml-5">
          服务商：
          <Select v-model="selectServiceProvider" @on-change="selectChange" :label-in-value="true"	style="width:200px">
            <Option v-for="item in selectListServiceProvider" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div> -->
      </div>


      <!-- 工程师列表 -->
      <Table @on-selection-change="selectionData" stripe :columns="table.columns" :data="table.data"></Table>
      <!-- 分页 -->
      <div class="clearfix">
        <Page :total="table.total"
          :page-size="table.size"
          show-elevator
          show-sizer
          show-total
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"></Page>
      </div>
    </div>
    <Action v-model="modalAction.show" :title="modalAction.title" :id="modalAction.id" :isUpdate="isUpdate" @submit-success="handleSubmitSuccess"></Action>
    <!-- <VEIMation v-model="modalEAltion.show" :title="modalEAltion.title"></VEIMation> -->
  </div>
</template>

<script>
  import Action from './Action'
  import router from '@/router'
  // import VEIMation from '../staticPage/ViewEngineerInformation'
  export default {
    // 名称
    name: 'Engineer',
    components: {
      Action
    },
    // 数据(初始/静态/待填充)
    data() {
      return {
        isUpdate: false,
        // select-model
        // 查询 -- 状态
        selectStatus: '',
        // 查询 -- 员工号
        accountCode: '',
        // 查询 -- 工程师姓名
        engineerName: '',
        // 查询 -- 手机号
        telephone: '',
        selectServiceLevel: '',
        selectServiceProvider: '',
        // option-value
        selectListStatus: [
          {
            value: '',
            label: '请选择'
          },
          {
            value: 'WAITTING',
            label: '待确认'
          },
          {
            value: 'NEW',
            label: '新建'
          },
          {
            value: 'HANG',
            label: '挂起'
          },
          {
            value: 'WORK',
            label: '上岗'
          },
          {
            value: 'FREEZE',
            label: '冻结'
          },
          {
            value: 'LEAVE',
            label: '离岗'
          }
        ],
        selectListServiceLevel: [
          {
            label: '一星级',
            value: 1
          },
          {
            label: '二星级',
            value: 2
          },
          {
            label: '三星级',
            value: 3
          },
          {
            label: '四星级',
            value: 4
          },
          {
            label: '五星级',
            value: 5
          },
          {
            label: '全部',
            value: ''
          },
        ],
        selectListServiceProvider: [],
        // 弹窗配置
        modalAction: {
          show: false,
          title: '',
          id: null
        },
        modalEAltion: {
          show: false,
          title: ''
        },
        CONST: {
          addEngineer: '新增/编辑工程师',
          updateEngineer: '新增/编辑工程师'
        },
        /* 表格配置 */
        table: {
          columns: [
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
            // {
            //   title: '序号',
            //   key: 'creditScore',
            //   align: 'center'
            // },
            {
              title: '状态',
              key: 'statusName',
              align: 'center'
            },
            {
              title: '员工号',
              key: 'accountCode',
              align: 'center',
              render: (h, {row, column, index}) => {
                return row.user.accountCode;
              }
            },
            {
              title: '工程师姓名',
              key: 'name',
              align: 'center',
              className: 'ivu-table-info-column-engineerName',
              render: (h, {row, column, index}) => {
                let remarkName = row.remarkName ? '(' + row.remarkName + ')' : ''
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
                  }, row.name + remarkName)
                ]);
              }
            },
            {
              title: '手机号',
              key: 'telephone',
              align: 'center',
              render: (h, {row, column, index}) => {
                let mobile = row.user.mobile
                return h('div', [
                  h('span', {}, mobile)
                ]);
              }
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
              key: 'operation',
              align: 'center',
              render: (h, params) => {
                let id = params.row.id
                let status = params.row.status
                let isQualificationAudit = params.row.isQualificationAudit // 是否被审核过
                  return h('div', [
                      h(
                        'Button', {
                          props: {
                              type: 'text'
                          },
                          style: {
                              // marginRight: '5px',
                              display: ['WAITTING', 'LEAVE'].includes(status)
                                       ? 'none'
                                       : 'inline-block'
                          },
                          on: {
                              click: () => {
                                  this._updateEngineer(id)
                              }
                          }
                        },
                        '编辑'
                      ),
                      h(
                        'Button', {
                          props: {
                              type: 'text'
                          },
                          style: {
                              // marginRight: '5px',
                              display: ['WORK', 'FREEZE'].includes(status)
                                       ? 'inline-block'
                                       : 'none'
                          },
                          on: {
                              click: () => {
                                this.ids = []
                                this.ids.push(this.table.data[params.index].id)
                                // 不是批量操作
                                this.isBatchHandle = false
                                this.hangData()

                              }
                          }
                        },
                        '挂起'
                      ),
                      h(
                        'Button', {
                          props: {
                              type: 'text'
                          },
                          style: {
                              // marginRight: '5px',
                              display: (['NEW', 'FREEZE', 'HANG'].includes(status) && isQualificationAudit)
                                       ? 'inline-block'
                                       : 'none'
                          },
                          on: {
                              click: () => {
                                this.ids = []
                                this.ids.push(this.table.data[params.index].id)
                                // 不是批量操作
                                this.isBatchHandle = false
                                this.postsData()

                              }
                          }
                        },
                        '上岗'
                      ),
                      h(
                        'Button', {
                          props: {
                              type: 'text'
                          },
                          style: {
                              // marginRight: '5px',
                              display: ['WORK', 'HANG'].includes(status)
                                       ? 'inline-block'
                                       : 'none'
                          },
                          on: {
                              click: () => {
                                this.ids = []
                                console.log(this.table.data[params.index])
                                this.ids.push(this.table.data[params.index].id)
                                // 不是批量操作
                                this.isBatchHandle = false
                                this.frozenData()

                              }
                          }
                        },
                        '冻结'
                      ),
                      h(
                        'Button', {
                          props: {
                              type: 'text'
                          },
                          style: {
                              // marginRight: '5px',
                              display: ['WORK', 'HANG', 'FREEZE'].includes(status)
                                       ? 'inline-block'
                                       : 'none'
                          },
                          on: {
                              click: () => {
                                this.ids = []
                                this.ids.push(this.table.data[params.index].id)
                                // 不是批量操作
                                this.isBatchHandle = false
                                this.beDemobilizedData()

                              }
                          }
                        },
                        '离岗'
                      ),
                      h(
                        'Button', {
                          props: {
                              type: 'text'
                          },
                          style: {
                            display: ['NEW'].includes(status) && !isQualificationAudit
                              ? 'inline-block'
                              : 'none'
                          },
                          on: {
                              click: () => {
                                  // 不是批量操作
                                  this.isBatchHandle = false
                                  // this.updateEngineer([id])
                                  this.confirmUpdateEngineer([id])
                              }
                          }
                        },
                        '信息审核'
                      ),
                      h(
                        'Button', {
                          props: {
                              type: 'text'
                          },
                          style: {
                            display: ['WAITTING', 'LEAVE'].includes(status)
                                     ? 'inline-block'
                                     : 'none'
                          },
                          on: {
                              click: () => {
                                  // 不是批量操作
                                  this.isBatchHandle = false
                                  this.updateIsDelById(id)
                              }
                          }
                        },
                        '删除'
                      )
                  ]);
              }
            }
          ],
          data: [
          ],
          total: 10,
          page: 1,
          size: 10
        },
        // 是否是系统管理员 或者 自建服务商
        isSystemOrSelf: true,
        ids: [],
        organizationIds: '',
        // 是否批量操作 - 返回code=999统一处理
        isBatchHandle: true
      }
    },
    created () {
      let userInfo = loginUtils.getUserInfo()
      // 是否为系统管理员

      if (userInfo.self || !userInfo.organizationId) {
        this.isSystemOrSelf = false
      } else {
        this.isSystemOrSelf = true
      }
      /* userInfo.organizationId ?
      this.isSystemOrSelf = true :
      this.isSystemOrSelf = false */
      // 依据服务商ID获取工程师列表
      this.organizationIds = userInfo.organizationIds
      this.getEngineerList()
      // 获取服务商列表
      let idList = userInfo.organizationIdList
      let nameList = userInfo.organizationNameList
      /* 如果无服务商 */
      if (!idList) {
        return
      }
      for (let i = 0, lenIdList = idList.length; i < lenIdList; i++) {
        this.selectListServiceProvider.push({
          label: nameList[i] || '',
          value: idList[i]
        })
      }
    },
    methods: {
      pageChange(page) {
        this.table.page = page;
        this.getEngineerList()
      },
      /* 改变页面容量，重新加载 */
      pageSizeChange(size) {
        this.table.size = size
        this.getEngineerList()
      },
      getEngineerList () {
        let newPage = common.analysisPage(this.table.page)
        let url = '/user/engineer/findEngineerListByQuery'
        let params = '?auditStatus=PASS' + // 审核状态PASS
                      (this.selectStatus ? '&status=' + this.selectStatus : '') + // 工程师状态
                      (this.selectServiceLevel ? '&level=' + this.selectServiceLevel : '') + // 工程师星级
                      (this.accountCode ? '&accountCode=' + this.accountCode : '') + // 员工号
                      (this.engineerName ? '&name=' + this.engineerName : '') + // 工程师姓名
                      (this.telephone ? '&telephone=' + this.telephone : '') + // 手机号
                      '&page=' + newPage + '&size=' + this.table.size// 页码与大小
        if (this.organizationIds) {
          for (let item of this.organizationIds) {
            params += ('&organizationIds=' + item)
          }
        } //组织id
        this.$http.get(url + params).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            let cdata = data.data
            this.table.data = cdata.content
            this.table.total = cdata.totalElements
          }
        })
      },
      // firstGetEngineerList () {
      //   let url = 'user/engineer/findEngineerListByQuery?organizationId=' + this.organizationId + '&page=0&size=10'
      //   this.$http.get(url).then(({data}) => {
      //     if (data.code == $HTTP.SUCCESS) {
      //       this.table.total = data.data.totalElements
      //       // this.table.size = data.data.size
      //       this.table.data = data.data.content
      //     }
      //   })
      // },
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
      selectChange (val) {
        // 下拉状态
        let status, statusName
        for (let item of this.selectListStatus) {
          if (item.value === val.value) {
            status = item.status
            statusName = item.label
          }
        }
        // this.getEngineerList()
      },
      lookup () {
        // 查找按钮
        this.getEngineerList()
      },
      Eliminate () {
        // 清空按钮
        this.selectStatus = ''
        this.accountCode = ''
        this.engineerName = ''
        this.telephone = ''
      },
      updateIsDelById(id) {
        let ids = [id]
        this.$Modal.confirm({
          title: '确认提示',
          content: '确认要删除角色吗？',
          loading: true,
          onOk: () => {
            this.updateIsDel(ids)
            // todo 删除
          },
          onCancel: () => {
            this.ids = []
          }
        })
      },
      updateIsDel(ids) {
        this.isBatchHandle ?
        this.$store.dispatch('setMessage', true) :
        this.$store.dispatch('setMessage', false)
        // let idsJson = JSON.stringify({ ids })
        this.$http.post(`/user/engineer/deleteEngineer`, ids, {
          headers: {
            'content-type': 'application/json;charset=UTF-8'
          }
        }).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.getEngineerList()
            this.$Notice.success({
              title: '成功提示',
              desc: `删除角色成功`
            })
          }
          this.$Modal.remove()
          this.ids = []
        })
      },
      updateIsDelBatch() {
        // 是批量操作
        this.isBatchHandle = true
        if (this.ids.length == 0) {
          this.$Notice.error({
            title: '警告提示',
            desc: `请至少选择一条数据`
          })
        } else {
          this.$Modal.confirm({
            title: '确认提示',
            content: '确认要删除角色吗？',
            loading: true,
            onOk: () => {
              this.updateIsDel(this.ids)
            },
            onCancel: () => {
              this.ids = []
            }
          })
        }
      },
      postObtainInfo (type, typeName) {
        this.isBatchHandle ?
        this.$store.dispatch('setMessage', true) :
        this.$store.dispatch('setMessage', false)
        // 批量操作
        this.$http.post(`/user/engineer/changeEngineerStatus?status=${type}&statusName=${typeName}`, this.ids).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.$Notice.success({
              title: '成功提示',
              desc: `操作成功`
            })
            //刷新
            this.getEngineerList()
          }
          this.$Modal.remove()
          this.ids = []
        })
      },
      postObtainInfo (type, typeName) {
        this.isBatchHandle ?
        this.$store.dispatch('setMessage', true) :
        this.$store.dispatch('setMessage', false)
        // 批量操作
        this.$http.post(`/user/engineer/changeEngineerStatus?status=${type}&statusName=${typeName}`, this.ids).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.$Notice.success({
              title: '成功提示',
              desc: `操作成功`
            })

            //刷新
            this.getEngineerList()
          }
          this.$Modal.remove()
          this.ids = []
        })
      },
      toExamineData () {
        // 审核
      },
      // 批量上岗按钮
      batchWork () {
        // 是批量操作
        this.isBatchHandle = true
        this.postsData ()
      },
      postsData () {
        // 上岗
        if (this.ids.length !== 0) {
          this.$Modal.confirm({
            title: '确认提示',
            content: '确认要上岗角色吗？',
            loading: true,
            onOk: () => {
              this.postObtainInfo('WORK', '上岗')
            },
            onCancel: () => {
              this.ids = []
            }
          })
        } else {
          this.$Notice.warning({
            title: '警告提示',
            desc: '请勾选！'
          })
        }
      },
      // 批量挂起按钮
      batchHang () {
        // 是批量操作
        this.isBatchHandle = true
        this.hangData()
      },
      hangData () {
        // 挂起
        if (this.ids.length !== 0) {
          this.$Modal.confirm({
            title: '确认提示',
            content: '确认要挂起角色吗？',
            loading: true,
            onOk: () => {
              this.postObtainInfo('HANG', '挂起')
            },
            onCancel: () => {
              this.ids = []
            }
          })
        } else {
          this.$Notice.warning({
            title: '警告提示',
            desc: '请勾选！'
          })
        }
      },
      // 批量冻结按钮
      batchFrozen () {
        // 是批量操作
        this.isBatchHandle = true
        this.frozenData()
      },
      frozenData () {
        // 冻结
        if (this.ids.length !== 0) {
          this.$Modal.confirm({
            title: '确认提示',
            content: '确认要冻结角色吗？',
            loading: true,
            onOk: () => {
              this.postObtainInfo('FREEZE', '冻结')
            },
            onCancel: () => {
              this.ids = []
            }
          })
        } else {
          this.$Notice.warning({
            title: '警告提示',
            desc: '请勾选！'
          })
        }
      },
      // 批量离岗按钮
      batchLeave () {
        // 是批量操作
        this.isBatchHandle = true
        this.beDemobilizedData()
      },
      beDemobilizedData () {
        // 离岗
        if (this.ids.length !== 0) {
          this.$Modal.confirm({
            title: '确认提示',
            content: '确认要离岗角色吗？',
            loading: true,
            onOk: () => {
              this.postObtainInfo('LEAVE', '离岗')
            },
            onCancel: () => {
              this.ids = []
            }
          })
        } else {
          this.$Notice.warning({
            title: '警告提示',
            desc: '请勾选！'
          })
        }
      },
      addEngineer () {
        // this.$store.dispatch('setMessage', true)
        let _this = this

        this.isUpdate = false
        this.modalAction.id = null
        this.modalAction.show = true
        this.modalAction.title = this.CONST.addEngineer
      },
      _updateEngineer (id) {
        this.isUpdate = true
        this.modalAction.id = id
        this.modalAction.show = true
        this.modalAction.title = this.CONST.updateEngineer
      },
      handleSubmitSuccess () {
        this.isUpdate = false
        // todo刷新
        this.getEngineerList()
      },
      updateEngineerBatch () {
        // 是批量操作
        this.isBatchHandle = true
        if (this.ids.length == 0) {
          this.$Notice.error({
            title: '警告提示',
            desc: `请至少选择一条数据`
          })
        } else {
          this.confirmUpdateEngineer()
        }
      },
      confirmUpdateEngineer (ids) {
        let _ids = ids || this.ids
        this.$Modal.confirm({
          title: '确认提示',
          content: '确认要审核选中项吗？',
          loading: true,
          onOk: () => {
            this.updateEngineer(_ids)
          },
          onCancel: () => {
            this.ids = []
          }
        })
      },
      updateEngineer (ids) {
        this.isBatchHandle ?
        this.$store.dispatch('setMessage', true) :
        this.$store.dispatch('setMessage', false)
        let url = `user/engineer/engineerMessageAudit`
        this.$http.post(url, ids).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.$Notice.success({
              title: '成功提示',
              desc: `审核成功`
            })
            this.getEngineerList()
          }
          this.$Modal.remove()
          this.ids = []
        })
      }
    },
    watch: {
      selectServiceProvider (val) {
        this.organizationIds = val
      }
    }
  }
</script>
<style>
  .ivu-table-info-column-engineerName{
    color: #019dd9;
    text-decoration: underline;
    cursor: pointer;
  }
  .page-engineer-queryFrame {
    padding: 10px 0 20px 0;
  }
  .in-block {
    padding-left: 20px;
    display: inline-block;
  }
</style>

