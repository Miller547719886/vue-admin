<template>
  <div class="page-engineer">
    <!-- 资质证书审核 -->
      <div class="tablePanel">
        <div class="clearfix">
          <!-- 状态下拉 -->
          <div class="pd_bottom_ten f-l flex align-center">
            资质类型：
            <Select class="pd_right_ten" v-model="descriptionType" v-on:on-change="selectChange" :label-in-value="true"	style="width:200px">
              <Option v-for="item in descriptionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <!-- 服务商：
            <Select v-model="organizationStatus" v-on:on-change="selectChange" style="width:200px">
              <Option v-for="item in organizationDataList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select> -->
          </div>
        </div>
        <!-- 角色列表 -->
        <Table stripe :columns="formInfo" :data="roleListData"></Table>
        <!-- 分页 -->
        <div class="clearfix">
        <Page :total="total"
          show-elevator
          show-sizer
          show-total
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"></Page>
        </div>
      </div>
      <!-- 是否审核/拒绝 弹窗 -->
      <EPopup v-model="modalEPopup.show" @submit-success="handleSubmitSuccess" :dataId="modalEPopup.dataId" :engineerId="modalEPopup.engineerId"></EPopup>
    </div>
</template>

<script>
  import EPopup from './ExaminePopup'
  export default {
    // 名称
    name: 'CertificateAudit',
    components: {
      EPopup
    },
    // 数据(初始/静态/待填充)
    data() {
      return {
        popUpIndex: 0,
        // 弹窗配置
        modalEPopup: {
          show: false,
          engineerId: '',
          dataId: ''
        },
        passOrRejectFlag: '',
        // 资质类型选择数据
        descriptionList: [
          {
            value: '',
            label: '请选择'
          },
          {
            value: 'one',
            label: '资质类型1'
          },
          {
            value: 'two',
            label: '资质类型2'
          },
          {
            value: 'three',
            label: '资质类型3'
          },
          {
            value: 'four',
            label: '资质类型4'
          },
          {
            value: 'other',
            label: '其他'
          }
        ],
        organizationDataList: [
          {
            value: '',
            label: '请选择'
          }
        ],
        // 表单数据
        formInfo: [
            {
              type: 'index',
              align: 'center',
              title: "序号"
            },
            {
              title: '状态',
              key: 'auditStatusName',
              align: 'center'
            },
            {
              title: '资质类型名称',
              key: 'typeName',
              align: 'center',
              render: (h, {row, column, index}) => {
                let type = row.type
                let typeName = row.typeName
                let name = row.name
                return h('span', {}, type === 'other' ? (typeName + '(' + name + ')') : typeName);
              }
            },
            {
              title: '证书编号',
              key: 'no',
              align: 'center'
            },
            {
              title: '工程师姓名',
              key: 'engineerName',
              align: 'center',
              render: (h, {row, column, index}) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        // console.log(column)
                        this.$router.push({path: 'EngineerInfo', query: { Eid: row.engineerId }})
                        // window.open('#/Engineer/EngineerInfo?Eid=' + row.engineerId)
                      }
                    }
                  }, row.engineerName)
                ]);
              }
            },
            {
              title: '手机号',
              key: 'telephone',
              align: 'center'
            },
            {
              title: '所属服务商',
              key: 'engineerService',
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
                              // 工程师id
                              let engineerId = this.roleListData[params.index].engineerId
                              let dataId = this.roleListData[params.index].id
                              this.modalEPopup.engineerId = engineerId
                              this.modalEPopup.dataId = dataId
                              this.modalEPopup.show = true
                            }
                        }
                    }, '审核')
                ]);
            }
          }
        ],
        // 列表信息
        roleListData: [],
        // 分页
        total: 0,
        page: 1,
        size: 10,
        // 下拉框
        organizationIds: [],
        descriptionType: '',
        organizationStatus: ''
      }
    },
    // 钩子(创建执行)
    mounted() {
      this.organizationIds = loginUtils.getUserInfo().organizationIds
      // this.organizationDataList[0].value = this.organizationIds = userInfo.organizationIds
      // 服务商select列表
      // common.getOrganizationList(this, this.organizationIds)
      // 获取列表
      this.getEngineerList()
    },
    // 方法
    methods: {
      getEngineerList () {
        let newPage = common.analysisPage(this.page)
        let url = '/user/engineer/findQualificationByQuery'
        let params = '?status=WAITTING' +
                      (this.descriptionType ? '&type=' + this.descriptionType : '') +
                      '&page=' + newPage +
                      '&size=' + this.size
        if (this.organizationIds) {
          for (let item of this.organizationIds) {
            params += ('&organizationIds=' + item)
          }
        }
        this.$http.get(url + params).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            if (data.data) {
              // 反向遍历，避免数组length改变而遗漏筛选
              /* for (let i = data.data.content.length - 1; i >= 0; i --) {
                if (data.data.content[i].auditStatus !== 'WAITTING') {
                  data.data.totalElements --
                  data.data.content.splice(i, 1)
                }
              } */
              this.total = data.data.totalElements
              this.size = data.data.size
              this.roleListData = data.data.content
            } else {
              this.roleListData = []
              this.total = 0
              this.size = 0
            }
          }
        })
      },
      pageChange (page) {
        this.page = page
        this.getEngineerList()
      },
      pageSizeChange (pageSize) {
        this.size = pageSize
        this.getEngineerList()
      },
      handleSubmitSuccess () {
        // 列表刷新刷新
        this.getEngineerList()
      },
      selectChange () {
        this.organizationIds = []
        // 重新赋值服务商id
        this.organizationStatus ?
        this.organizationIds.push(this.organizationStatus) :
        this.organizationIds = loginUtils.getUserInfo().organizationIds
        // console.log(loginUtils.getUserInfo().organizationIds, 7878787878)
        this.page = 1
        this.getEngineerList()
      }
    }
  }
</script>
<style scoped>
  .ivu-table-info-column-engineerName{
    color: #019dd9;
    text-decoration: underline;
    cursor: pointer;
  }
  .pd_bottom_ten {
    padding-bottom: 10px;
  }
  .pd_right_ten {
    padding-right: 10px;
  }
</style>

