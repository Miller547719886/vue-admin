<template>
<!-- 资质证书审核记录 -->
  <div class="page-engineer">
      <div class="tablePanel">
        <div class="clearfix">
          <!-- 状态下拉 -->
          <div class="pd_bottom_ten f-l flex align-center">
            资质类型：
            <Select class="pd_right_ten" v-model="descriptionType" v-on:on-change="selectChange" :label-in-value="true"	style="width:200px">
              <Option v-for="item in descriptionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            状态：
            <Select class="pd_right_ten" v-model="selectStatus" v-on:on-change="selectChange" :label-in-value="true"	style="width:200px">
              <Option v-for="item in selectListStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <!-- 服务商：
            <Select v-model="organizationStatus" v-on:on-change="selectChange" :label-in-value="true"	style="width:200px">
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
      <EXCancel @submit-success="handleSubmitSuccess" v-model="modalEPopup.show" :dataId="modalEPopup.dataId" :engineerId="modalEPopup.engineerId"></EXCancel>
    </div>
</template>

<script>
  import EXCancel from './ExamineCancel'
  export default {
    // 名称
    name: 'CertificateRecord',
    components: {
      EXCancel
    },
    // 数据(初始/静态/待填充)
    data() {
      return {
        organizationIds: [],
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
        // 状态选择数据
        organizationDataList: [
          {
            value: '',
            label: '请选择'
          },
        ],
        selectListStatus: [
          // {
          //   value: 'WAITTING',
          //   label: '待审核'
          // },
          {
            value: 'PASSORREJECT',
            label: '请选择'
          },
          {
            value: 'PASS',
            label: '审核通过'
          },
          {
            value: 'REJECT',
            label: '审核不通过'
          }
        ],
        // 表单数据
        formInfo: [
            {
              type: 'index',
              align: 'center',
              title: "序号"
            },
            /* {
              title: '序号',
              key: 'creditScore',
              align: 'center'
            }, */
            {
              title: '状态',
              key: 'auditStatusName',
              align: 'center'
            },
            {
              title: '资质类型',
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
              title: '有效期',
              key: 'termOfValidity',
              align: 'center'
            },
            {
              title: '工程师姓名',
              key: 'engineerName',
              align: 'center'
              // render: (h, {row, column, index}) => {
              //   return h('div', [
              //     h('Button', {
              //       props: {
              //         type: 'text',
              //         size: 'small'
              //       },
              //       on: {
              //         click: () => {
              //           // console.log(column)
              //           // this.$router.push({path: 'EngineerInfo', query: { Eid: row.id }})
              //           window.open('#/Engineer/EngineerInfo?Eid=' + row.engineerId)
              //         }
              //       }
              //     }, row.engineerName)
              //   ]);
              // }
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
              title: '审核日期',
              key: 'auditTime',
              align: 'center',
              width: '100'
            },
            {
              title: '审核人',
              key: 'auditUserName',
              align: 'center'
            },
            {
              title: '审核组织',
              key: 'auditOrgName',
              align: 'center',
              render: (h, {row, column, index}) => {
                let str = '快益点总部'
                row.auditOrgName ?
                str = row.auditOrgName :
                ''
                return str
              }
            },
            {
              title: '审核说明',
              key: 'auditDesc',
              align: 'center'
            },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
                let auditStatus = params.row.auditStatus
                return h('div', [
                    h('Button', {
                        props: {
                            type: 'text',
                            size: 'small'
                        },
                        style: {
                            marginRight: '5px',
                            display: ['WAITTING', 'REJECT'].includes(auditStatus)
                                       ? 'none'
                                       : 'inline-block'
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
                    }, '取消资质')
                ]);
            }
          }
        ],
        // 列表信息
        roleListData: [
        ],
        /* 分页 */
        total: 0,
        page: 1,
        size: 10,
        // 下拉框
        selectStatus: 'PASSORREJECT',
        organizationStatus: '',
        descriptionType: '',
      }
    },
    created() {
      this.selectStatus = 'PASSORREJECT'
      this.organizationIds = loginUtils.getUserInfo().organizationIds
      // this.organizationDataList[0].value = this.organizationIds = userInfo.organizationIds
      // 获取服务商列表
      // common.getOrganizationList(this, this.organizationIds)
      // 依据服务商ID获取工程师列表
      this.getEngineerList()
    },
    methods: {
      getEngineerList () {
        let newPage = common.analysisPage(this.page)
        let url = '/user/engineer/findQualificationByQuery' +
                      '?page=' + newPage +
                      '&size=' + this.size +
                      (this.descriptionType ? '&type=' + this.descriptionType : '') +
                      (this.selectStatus ? '&status=' + this.selectStatus : '')
        if (this.organizationIds) {
          for (let item of this.organizationIds) {
            url += ('&organizationIds=' + item)
          }
        }
        this.$http.get(url).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            if (data.data) {
              this.total = data.data.totalElements
              this.size = data.data.size
              this.roleListData = data.data.content
              // 列表有效期
              data.data.content.forEach((item, index) => {
                if (item.auditStatus == 'PASS') {
                  if (item.isLongTerm == 1) {
                    this.roleListData[index].termOfValidity = '长期有效'
                  } else if (item.endTime) {
                    // 处理有效期格式
                    this.roleListData[index].termOfValidity = item.endTime.substr(0, 10)
                  }
                } else {
                  this.roleListData[index].termOfValidity = '无'
                }
              })
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
        // 数据刷新
        this.getEngineerList()
      },
      selectChange () {
        // console.log(this.organizationStatus, 121212)
        this.organizationIds = []
        // 重新赋值服务商id
        this.organizationStatus ?
        this.organizationIds.push(this.organizationStatus) :
        this.organizationIds = loginUtils.getUserInfo().organizationIds
        this.page = 1
        this.getEngineerList()
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
  .pd_bottom_ten {
    padding-bottom: 10px;
  }
  .pd_right_ten {
    padding-right: 10px;
  }
  .page-engineer .ivu-select-single .ivu-select-selection .ivu-select-placeholder{
    color: #495060;
  }
</style>

