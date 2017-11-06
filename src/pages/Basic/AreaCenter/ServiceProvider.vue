<template>
  <div class="area-center-service-provider">
    <Modal v-model="unHandleServiceTable.formModal"
        :title="unHandleServiceTable.modalName"
        width="1000px"
        :mask-closable="false">
      <Button-group>
        <Button @click="areaCenterList">
          片区设置
        </Button>
      </Button-group>
      <Table border style="margin-top: 10px"
             :columns="unHandleServiceTable.columns"
             :data="unHandleServiceTable.data"
             @on-selection-change="selectService">
      </Table>
      <div class="clearfix">
        <Page :total="unHandleServiceTable.total"
              :page-size="unHandleServiceTable.size"
              show-elevator
              show-total
              @on-change="pageChangeUnHandleServiceTable"
              @on-page-size-change="pageSizeChangeUnHandleServiceTable"></Page>
      </div>
      <div slot="footer">
        <Button @click="closeUnHandleServiceTable">确认
        </Button>
      </div>
    </Modal>
    <Modal v-model="areaCenterListTable.formModal"
           :title="areaCenterListTable.modalName"
           width="1000px"
           :mask-closable="false">
      <Table border style="margin-top: 10px"
             :columns="areaCenterListTable.columns"
             :data="areaCenterListTable.data"
             @on-selection-change="selectArea"
      >
      </Table>
      <div class="clearfix">
        <Page :total="areaCenterListTable.total"
              :page-size="areaCenterListTable.size"
              show-elevator
              show-total
              @on-change="pageChangeAreaCenterTable"
              @on-page-size-change="pageSizeChangeAreaCenterTable"></Page>
      </div>
      <div slot="footer">
        <Button @click="closeAreaCenterListTable">确认
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'AreaCenterServiceProvider',
    data () {
      return {
        /*待处理服务商弹窗*/
        unHandleServiceTable: {
          modalName: '未绑定服务商列表',
          formModal: false,
          /*table数据*/
          data: [],
          ids:[],
          columns: [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '组织编号',
              key: 'code',
            },
            {
              title: '名称',
              key: 'name',
            },
            {
              title: '地址',
              key: 'detailedAddress',
            },
            {
              title: '联系电话',
              key: 'telephone',
            },
            {
              title: '操作',
              key: 'action',
              render: (h, {row, column, index}) => {
                let id = row.id
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
                        this.areaCenterList(id)
                      }
                    }
                  }, '片区设置')
                ]);
              }
            }
          ],
          /*初始化总页数*/
          total: 0,
          /*初始化时的当前页*/
          page: 1,
          /*初始化时的每页显示多少个*/
          size: 10
        },
        areaCenterListTable:{
          modalName:'片区列表',
          formModal:false,
          data:[],
          columns: [
            {
              title: '组织编号',
              key: 'code',
            },
            {
              title: '名称',
              key: 'name',
            },
            {
              title: '地址',
              key: 'detailedAddress',
            },
            {
              title: '联系电话',
              key: 'telephone',
            },
            {
              title: '操作',
              key: 'action',
              render: (h, {row, column, index}) => {
                let id = row.id
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
                        this.bindServiceAndAreaCenter(id)
                      }
                    }
                  }, '选择')
                ]);
              }
            }
          ],
          total:0,
          page:1,
          size:10
        },
      }
    },
    props: {
      value: {
        type: Boolean,
        require: true,
        default: false
      }
    },
    created () {
      /* 刷新主表格 */
      // this.refresh()
    },
    methods: {
      closeUnHandleServiceTable () {
        this.unHandleServiceTable.formModal = false
      },
      closeAreaCenterListTable () {
        this.areaCenterListTable.formModal = false
      },
      load(table) {
        //先至为空 否则会热替换
        table.data = [];
        let newPage = common.analysisPage(table.page)
        //获取营销公司
        this.$http.get('/user/organization/findTopListByType?page=' + newPage + '&size=' + table.size + '&type=MLSALESCOMPANY').then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            let cdata = data.data
            this.setPage(table, cdata);
            table.data = cdata.content
          }
        })
      },
      //待处理服务商列表
      unHandleService(){
        this.unHandleServiceTable.formModal = true
        let newPage = common.analysisPage(this.unHandleServiceTable.page)
        this.$http.get(`/user/organization/unHandleServiceList?page=${newPage}&size=${this.unHandleServiceTable.size}`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            let cdata = data.data
            this.setPage(this.unHandleServiceTable, cdata);
            this.unHandleServiceTable.data = cdata.content
          }
        })
      },
      setPage(table, cdata){
        table.total = cdata.totalElements;
        table.size = cdata.size;
        table.page = cdata.number + 1;
      },
      //片区列表
      areaCenterList(id){
        if (typeof id === 'number') {
          this.unHandleServiceTable.ids.push(id)
        }
        if (!this.unHandleServiceTable.ids.length) {
          this.$Notice.error({
            title: '错误提示',
            desc: `请选择至少一条服务商`
          })
          return
        }
        this.areaCenterListTable.formModal = true
        let newPage = common.analysisPage(this.areaCenterListTable.page)
        this.$http.get(`/user/organization/findAreaByPage?page=${newPage}&size=${this.areaCenterListTable.size}`).then(({data}) => {
          if (data.data.code == $HTTP.SUCCESS) {
            let cdata = data.data
            this.setPage(this.areaCenterListTable, cdata);
            this.areaCenterListTable.data = cdata.content
          }
        })
      },
      //绑定服务商和片区
      bindServiceAndAreaCenter(id){
          //这里需要服务商的id数组和片区的id
        let ids = this.unHandleServiceTable.ids
        alert(ids);
        this.$http.post(`/user/organization/bindServiceAndAreaCenter?areaCenterId=${id}`, ids).then(({data}) =>{
          if (data.code == $HTTP.SUCCESS) {
            this.$Modal.remove()
            this.load(this.areaCenterListTable)
            this.$Notice.success({
              title: '成功提示',
              desc: `绑定成功`
            })
          }
        })
      },
      pageChangeUnHandleServiceTable(pageNum) {
        this.unHandleServiceTable.page = pageNum;
        this.unHandleService()
      },
      pageSizeChangeUnHandleServiceTable(size) {
        this.unHandleServiceTable.size = size;
        this.unHandleService()
      },
      pageChangeAreaCenterTable(pageNum) {
        this.areaCenterListTable.page = pageNum;
        this.areaCenterList()
      },
      pageSizeChangeAreaCenterTable(size) {
        this.areaCenterListTable.size = size;
        this.areaCenterList()
      },
      selectService(data) {
          console.log(data);
        this.unHandleServiceTable.ids = common.getColumnData(data, 'id')
      },
      selectArea(data) {
        this.areaCenterListTable.ids = common.getColumnData(data, 'id')
      },
    },
    model: {
      prop: 'value',
      event: 'input'
    },
    computed: {
    },
    watch: {
      value (val) {
        this.unHandleServiceTable.formModal = val
        if (!!val === true) {
          this.unHandleService()
        }
      },
      'unHandleServiceTable.formModal' (val) {
        this.$emit('input', val)
      }
    }
  }
</script>
