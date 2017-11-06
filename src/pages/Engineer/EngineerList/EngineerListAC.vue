<template>
  <!-- 工程师列表-区域中心 -->
  <div class="page-engineer">
    <div class="tablePanel">
      <div class="clearfix">
        <!-- 服务商下拉 -->
        <!-- <div class="f-l flex align-center mr-10">
          服务商：
          <Select v-model="organizationStatus" @on-change="selectChange" :label-in-value="true"	style="width:200px">
            <Option v-for="item in organizationDataList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div> -->
        <!-- 状态下拉 -->
        <div class="f-l flex align-center mr-10">
          状态：
          <Select v-model="selectStatus" @on-change="selectChange" :label-in-value="true"	style="width:200px">
            <Option v-for="item in selectListStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <!-- 星级下拉 -->
        <div class="f-l flex align-center mr-10">
          服务星级：
          <Select v-model="selectServiceLevel" @on-change="selectChange" :label-in-value="true"	style="width:200px">
            <Option v-for="item in selectListServiceLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div style="display: inline-block">
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
          <Button @click="lookUp">查询</Button>
        </div>
      </div>
      <!-- 工程师列表 -->
      <Table class="paddingTop" stripe :columns="table.columns" :data="table.data"></Table>
      <!-- 分页 -->
      <div class="clearfix">
      <Page :total="table.total"
          show-elevator
          show-sizer
          show-total
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"></Page>
      </div>
    </div>
  </div>
</template>

<script>
  // import VEIMation from '../staticPage/ViewEngineerInformation'
  export default {
    // 名称
    name: 'Engineer',
    components: {
    },
    // 数据(初始/静态/待填充)
    data() {
      return {
        isUpdate: false,
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
            label: '请选择',
            value: ''
          },
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
          }
        ],
        organizationDataList: [
          {
            value: '',
            label: '请选择'
          }
        ],
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
          addEngineer: '新增工程师',
          updateEngineer: '工程师申请 - 待审核'
        },
        /* 表格配置 */
        table: {
          columns: [
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
                        this.$router.push({path: 'EngineerInfo', query: { Eid: row.id }})
                        // window.open('#/Engineer/EngineerInfo?Eid=' + row.id)
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
              title: '所属服务商',
              key: 'organizationName',
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
                    h('span', {
                        // on: {
                        //     click: () => {
                        //         // this.show(params.index)
                        //     }
                        // }
                    }, uTime || cTime)
                ])
              }
            }
          ],
          // 表格信息
          data: [
          ],
          // 分页
          total: 0,
          page: 1,
          size: 10
        },
        // 下拉选项
        organizationIds: [],
        selectStatus: '',
        selectServiceLevel: '',
        organizationStatus: '',
        // 查询 -- 员工号
        accountCode: '',
        // 查询 -- 工程师姓名
        engineerName: '',
        // 查询 -- 手机号
        telephone: ''
      }
    },
    created () {
      this.organizationIds = loginUtils.getUserInfo().organizationIds
      // 获取服务商列表
      // common.getOrganizationList(this, this.organizationIds)
      // 依据服务商ID获取工程师列表
      this.getEngineerList()
    },
    methods: {
      getEngineerList () {
        let newPage = common.analysisPage(this.table.page)
        let url = '/user/engineer/findEngineerListByQuery'
        let params =  '?isQualificationAudit=1' +
                      '&page=' + newPage +
                      '&size=' + this.table.size +
                      (this.selectStatus ? '&status=' + this.selectStatus : '') +
                      (this.selectServiceLevel ? '&level=' + this.selectServiceLevel : '') +
                      (this.accountCode ? '&accountCode=' + this.accountCode : '') +
                      (this.engineerName ? '&name=' + this.engineerName : '') +
                      (this.telephone ? '&telephone=' + this.telephone : '')
        if (this.organizationIds) {
          for (let item of this.organizationIds) {
            params += ('&organizationIds=' + item)
          }
        }
        this.$http.get(url + params).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.table.total = data.data.totalElements
            this.table.size = data.data.size
            data.data.content.forEach((item, index) => {
              item.organizationName = item.organization.name
            })
            this.table.data = data.data.content
          }
        })
      },
      lookUp () {
        // 查询
        this.getEngineerList()
      },
      Eliminate () {
        // 清空
        this.selectStatus = ''
        this.selectServiceLevel = ''
        this.accountCode = ''
        this.engineerName = ''
        this.telephone = ''
      },
      pageChange (page) {
        this.table.page = page
        this.getEngineerList()
      },
      pageSizeChange (pageSize) {
        this.table.size = pageSize
        this.getEngineerList()
      },
      selectChange (val) {
        // console.log(this.organizationStatus, 111111111)
        this.organizationIds = []
        // 重新赋值服务商id
        this.organizationStatus ?
        this.organizationIds.push(this.organizationStatus) :
        this.organizationIds = loginUtils.getUserInfo().organizationIds
        this.page = 1
        // 下拉状态
        // this.getEngineerList()
      },
      addEngineer () {
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
      updateEngineer () {
        this.modalEAltion.show = true
        this.modalEAltion.title = this.CONST.updateEngineer
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
  .paddingTop {
    padding-top: 10px;
  }
  .in-block {
    padding-left: 10px;
    display: inline-block;
  }
</style>

