<template>
  <!-- 不分页筛选表格 -->
  <div class="filter-table">
    <Modal v-show="isTransferMode"
      v-model="modalTransfer.show"
      :title="modalTransfer.title"
      width="710px"
      @on-ok="saveColumnsConfig">
      <CTransfer :data="transferData" :target-keys="targetKeys" :titles="titles"></CTransfer>
    </Modal>
    <div class="clearfix">
      <Checkbox-group ref="checkList" class="mt-10 f-l"
        v-show="isCheckMode"
        v-model="tableColumnsChecked"
        @on-change="fillTableColumns"
        @on-current-change="CurrentChange"
        @on-select="Select"
        @on-select-cancel="SelectCancel"
        @on-select-all="SelectAll"
        @on-selection-change="SelectionChange"
        @on-sort-change="SortChange"
        @on-row-click="RowClick"
        @on-row-dblclick="RowDblclick"
        @on-expand="Expand">
        <Checkbox :ref="'check' + index"
          v-for="(item, index) in checkList"
          :disabled="checkDisabled(item)"
          :label="item" :key="item"></Checkbox>
      </Checkbox-group>
      <div class="topButton">
        <button class="but_c" @click="showModalTransfer" v-if="isTransferMode">
          <Icon type="compose" size="18"></Icon> 自定义列表显示内容
        </button>
        <button class="but_c" @click="exportData" v-if="exportExcel">
          <Icon type="ios-upload-outline" size="18"></Icon> 导出Excel
        </button>
      </div>
    </div>
    <div class="topPosition">
      <Table stripe ref="table"
           :columns="filteredColumns"
           :id="id"
           :data="data"
           @on-selection-change="emitSelectionChange"
           @on-current-change="emitCurrentChange">
      </Table>
    </div>
  </div>
</template>
<script>
  /**
   * @prop columns 表格列配置
   * ps：
   * 1. 父组件调用方法本组件方法不能在created中调用！（因为未挂载到dom上，检测不到ref）
   * 2. 父组件中的回调函数要用.bind(this)方法修复this指向问题
   * 3. transfer里的key定义规则：columes中存在key则为key，不存在则为type。
   */
  import CTransfer from '@/components/Transfer/Index'
  export default {
    name: 'FilterTable',
    components: {
      CTransfer
    },
    data () {
      return {
        filteredColumns: [],
        data: [],
        /* 筛选多选框 */
        tableColumnsChecked: [],
        size: 10,
        page: 1,
        total: 0,
        disableSelection: ['多选', '操作'], // 根据type判断是否禁用
        defaultKeys: ['page', 'size'],
        titles: ['已过滤列', '已选择列'],
        modalTransfer: {
          show: false,
          title: '自定义列表',
        },
        transferRightList: [],
        targetKeys: [],
        transferData: []
      }
    },
    props: {
      columns: {
        type: Array,
        require: true,
        default: []
      },
      mode: { // 计算顺序：父组件中绑定mode->PageTable中默认mode(若不引用PageTable则忽略此项)->当前默认mode
        type: String,
        require: false,
        default: 'transfer' // check transfer
      },
      exportExcel: {
        type: Boolean,
        require: false,
        default: false
      },
      id: {
        type: String,
        require: true,
        default: ''
      },
      context: Object
    },
    created () {
      // 获取当前表格对应的全部columns与targetKeys
    },
    mounted () {
      this.fillTableColumns()
    },
    methods: {
      /**
       * 不分页表格加载
       * @param url 请求url ``
       * @param params 参数 ``
       */
      load (config, cb) {
        if (config) {
          if (config.url) {
            this.url = config.url
          }
          if (config.params) {
            this.params = config.params
          }
          if (config.page) {
            this.page = config.page
          }
          if (config.size) {
            this.size = config.size
          }
        }
        let newPage = common.analysisPage(this.page)
        let paramsStr = this.params2Str(this.params)
        if (config.page && config.size) {
          // 分页请求
          this.$http.get(this.url + paramsStr + (paramsStr ? `&` : `?`) + `page=${newPage}&size=${this.size}`).then(({data}) => {
            if (data.code == $HTTP.SUCCESS) {
              let cdata = data.data
              this.data = cdata.content
              this.total = cdata.totalElements
              this.emitTotal(this.total)
            }
          })
        } else {
          // 不分页请求
          this.$http.get(this.url + paramsStr).then(({data}) => {
            if (data.code == $HTTP.SUCCESS) {
              let cdata = data.data
              this.data = cdata
            }
          })
        }
        if (cb) {
          cb() // 回调
        }
      },
      checkDisabled (item) {
        if (this.disableSelection.includes(item)) {
          return true
        }
      },
      emitTotal (val) {
        this.$emit('on-total-change', val)
      },
      /* 参数转化为字符串 */
      params2Str (params) {
        let str = ``
        let paramsArray = Object.entries(params)
        let i = 0
        for (let [k, v] of paramsArray) {
          if (!this.defaultKeys.includes(k)) { // 排除页码与每页容积
            if (v) { // 排除undefined
              str += ((i === 0) ? `?` : `&`) + `${k}=${v}`
              i++
            } else {
              console.log('异常参数：' + k, '异常参数值：' + v)
            }
          }
        }
        return str
      },
      /* 获取处理后表格列 */
      getTable2Columns () {
        /* 复制表格列副本 */
        const fullColumns = common.fullCopyObj(this.columns)
        /* 初始化筛选table columns */
        let columns = []
        fullColumns.forEach((item) => {
          if (this.tableColumnsChecked.includes('多选') && item.type === 'selection') { // 多选根据type判断
            columns.push(item)
          }
          if (this.tableColumnsChecked.includes(item.title)) { // 其他根据title判断
            columns.push(item)
          }
        })
        /* 返回table columns */
        return columns
      },
      /* 填充表格结构 */
      fillTableColumns () {
        this.filteredColumns = this.getTable2Columns()
      },
      toggleFav (index) {
        this.tableData2[index].fav = this.filteredData[index].fav === 0 ? 1 : 0;
      },
      /* @param 选中ids */
      emitSelectionChange (ids) {
        this.$emit('on-selection-change', ids)
      },
      emitCurrentChange (currentRow, oldCurrentRow) {
        this.$emit('on-current-change', currentRow, oldCurrentRow)
      },
      CurrentChange (msg) {

      },
      Select (msg) {

      },
      SelectCancel (msg) {

      },
      SelectAll (msg) {

      },
      SelectionChange (msg) {

      },
      SortChange (msg) {

      },
      RowClick (msg) {

      },
      RowDblclick (msg) {

      },
      Expand (msg) {

      },
      triggerClick (v) {
        let checkValue = this.$r.reject(this.isDisabled)(v)[0]
        let index = this.checkList.indexOf(checkValue)
        let label = this.$refs['check' + index][0].$el
        let input = label.querySelectorAll('input')[0]
        dom.trigger('click', input)
        this.$refs['check' + index][0].$forceUpdate()
      },
      isDisabled (n) {
        return this.disableSelection.includes(n)
      },
      showModalTransfer () {
        this.getFullColumns()
        this.getTargetKey()
        this.modalTransfer.show = true
      },
      saveColumnsConfig () {
        let _columns = []
        this.targetKeys.map((item, index, array) => {
          _columns.push(() => {
            return this.columns.find((_item, _index, _array)=> {
              (_item.key || _item.type) === item
            })
          })
        })
        console.log(_columns, 'xx')
      },
      getFullColumns () {
        this.transferData = this.changeColumns2Transfer(this.columns)
      },
      getTargetKey () {
        if (configUtils.getColumnsKey(this.id)) {
          this.targetKeys
        } else {
          this.targetKeys = this.changeColumns2Transfer(this.columns).map((item, index) => {
            return item.key
          })
        }
      },
      /**
       * @param columns
       * @return  { key, label, disabled }
       */
      changeColumns2Transfer (data) {
        let _this = this
        let ds= this.disableSelection
        return data.map((item, index) => {
          let _item
          _item = {
            key: _this.formatColumnsItemKey(item),
            label: _this.formatColumnsItemLabel(item),
            disabled: ds.includes(item.title) ||  item.type === 'selection'
          }
          return _item
        })
      },
      exportData (event, type = 1) {
        // if (type === 1) {
        //   this.$refs.table.exportCsv({
        //     filename: '原始数据'
        //   });
        // } else if (type === 2) {
        //   this.$refs.table.exportCsv({
        //     filename: '排序和过滤后的数据',
        //     original: false
        //   });
        // } else if (type === 3) {
        //   this.$refs.table.exportCsv({
        //     filename: '自定义数据',
        //     columns: this.columns8.filter((col, index) => index < 4),
        //     data: this.data7.filter((data, index) => index < 4)
        //   });
        // }
        alert(type)
      },
      formatColumnsItemLabel (item) {
        return (item.title || (item.type === 'selection' ? '多选' : '--'))
      },
      formatColumnsItemKey (item) {
        return (item.key || item.type)
      }
    },
    computed: {
      checkList () {
        let list = Object.values(this.columns).map((item) => {
          return this.formatColumnsItemLabel(item)
        })
        /* 初始化被勾选项目为全部 */
        this.tableColumnsChecked = list
        return list
      },
      isCheckMode () {
        return this.mode === 'check'
      },
      isTransferMode () {
        return this.mode === 'transfer'
      }
    },
    watch: {
      /* 监听checkbox变化 */
      tableColumnsChecked (newV, oldV) {
        /* 如果不存在禁用勾选项之外的任何勾选项 */
        if (!this.$r.reject(this.isDisabled)(newV).length) {
          this.tableColumnsChecked = oldV
          this.$Message.warning('请至少保留一条有效列内容！')
          this.triggerClick(oldV) // 模拟触发点击（最后一个被取消的勾选恢复勾选状态）
        }
        /* 更改表格列配置 */
        this.filteredColumns = this.getTable2Columns()
      }
    }
  }
</script>
<style lang="scss">
.filter-table {
  // .topPosition {
  //   position: relative;
    .topButton {
      width: auto;
      height: 38px;
      border-radius: 10px 10px 0 0;
      line-height: 38px;
      border: 2px solid #5E90A9;
      border-bottom: none;
      background-color: #C2E8FB;
      float: right;
    }
  // }
  .but_c {
    cursor: pointer;
    padding: 0 10px;
    background: none;
    border-top-style: none;
    border-right-style: none;
    border-bottom-style: none;
    border-left-style: none;
    outline:none;
  }
}

</style>
