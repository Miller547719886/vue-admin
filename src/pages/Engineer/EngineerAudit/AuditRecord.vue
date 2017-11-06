<template>
  <!-- 审核记录 -->
  <div class="page-engineer-toExamine">
    <div class="tablePanel">
      <div class="clearfix">
        <!-- 选项 -->
        状态：
        <Select v-on:on-change="getListInfo" v-model="auditStatus" placeholder="请选择状态" style="width:200px">
          <Option v-for="item in stateListData" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <!-- 角色列表 -->
      <Table class="mt-10" stripe :columns="listHeader" :data="listBody"></Table>
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
  </div>
</template>

<script>
  export default {
    // 名称
    name: 'EngineerToExamine',
    components: {
    },
    // 数据(初始/静态/待填充)
    data() {
      return {
        modalApplication: true,
        // 状态选择数据
        stateListData: [
          {
              value: 'PASSORREJECT',
              label: '请选择'
          },
          {
              value: 'PASS',
              label: '已通过'
          },
          {
              value: 'REJECT',
              label: '已拒绝'
          }
        ],
        auditStatus: '',
        // 表单数据
        listHeader: [
          {
            type: 'selection',
            width: 55,
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
            render: (h, {row, column, index}) => {
              let statusName = row.user.auditStatus
              return this.analysisStatus(statusName)
            },
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
            title: '注册日期',
            key: 'userCreateTime',
            render: (h, {row, column, index}) => {
              let createTime = row.user.createTime
              return createTime
            },
            align: 'center',
            width: '100'
          },
          {
            title: '审核日期',
            key: 'engineerEventDate',
            align: 'center',
            width: '100',
            render: (h, {row, column, index}) => {
              /* // 待审核就没有审核日期
              let eventCode = row.engineerEvent.length ? row.engineerEvent[0].eventCode : ''
              let isPassOrReject = ['PASS', 'REJECT'].includes(eventCode)
              let eventTime = isPassOrReject
                ? row.user.auditTime
                : '' */

              return row.user.auditTime
            },
          }
        ],
        listBody: [
        ],
        organizationIds: [],
        page: 1,
        size: 10,
        total: 0,
      }
    },
    // 钩子(创建执行)
    created() {
      let userInfo = common.getStorage('USER_KEY')
      this.organizationIds = userInfo.organizationIds
      this.getListInfo()
    },
    // 方法
    methods: {
      getListInfo () {
        let newPage = common.analysisPage(this.page)
        let url = 'user/engineer/findEngineerListByQuery'
        url += (this.auditStatus ? ('?auditStatus=' + this.auditStatus) : '?auditStatus=PASSORREJECT') +
                '&page=' + newPage +
                '&size=' + this.size +
                '&sourceType=APP_REGISTER'
        if (this.organizationIds) {
          for (let item of this.organizationIds) {
            url += ('&organizationIds=' + item)
          }
        }
        this.$http.get(url).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            let cdata = data.data
            this.listBody = cdata.content
            this.total = cdata.totalElements
          }
        })
      },
      pageChange(page) {
        this.page = page;
        this.getListInfo()
      },
      /* 改变页面容量，重新加载 */
      pageSizeChange(size) {
        this.size = size
        this.getListInfo()
      },
      analysisStatus (statusCode) {
        let res = this.stateListData.map((item) => {
          if (item.value === statusCode) {
            return item.label
          }
        })
        return res
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
</style>

