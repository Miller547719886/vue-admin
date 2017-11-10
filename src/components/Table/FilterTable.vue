<template>
  <!-- 不分页筛选表格 -->
  <div class="filter-table">
    <div v-if="modalTransfer.exist">
      <Modal v-show="isTransferMode"
        v-model="modalTransfer.show"
        :title="modalTransfer.title"
        width="710px"
        @on-ok="saveColumnsConfig">
        <CTransfer ref="CTransfer"
          :disabledSelections="disabledSelections"
          :data="transferData"
          v-model="targetKeys"
          :titles="titles"
          @on-right-data-change="handleRightDataChange"></CTransfer>
      </Modal>
    </div>
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
        <button class="but_c" @click="setDefault">
          <Icon type="ios-upload-outline" size="18"></Icon>恢复默认配置
        </button>
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
   * 1. 父组件调用方法本组件方法不能在created中调用！（因为未挂载到dom上，检测不到ref）。
   * 2. 父组件中的回调函数要用.bind(this)方法修复this指向问题。
   * 3. transfer里的key定义规则：columes中存在key则为key，不存在则为type。
   * 4. 每个table都需要用id来标记，用途是获取本地存储对应的配置对象。
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
        disabledSelections: ['多选', '操作', 'selection', 'action'], // 根据type判断是否禁用
        defaultKeys: ['page', 'size'],
        titles: ['已过滤列', '已选择列'],
        modalTransfer: {
          show: false,
          title: '自定义列表',
          exist: false
        },
        transferRightList: [],
        targetKeys: [],
        transferData: [],
        keysToSave: [],
        configColumnsKey: null
      }
    },
    props: {
      columns: {
        type: Array,
        require: true,
        default: () => []
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
      console.log(_.chunk(['a', 'b', 'c', 'd'], 2))
    },
    methods: {
      /* 重置为默认列配置 */
      setDefault () {
        configUtils.clearColumnsKey()
        this.filteredColumns.length = 0
        this.filteredColumns.push(...this.columns)
      },
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
        if (this.disabledSelections.includes(item)) {
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
        this.updateConfigColumnsKey() // 更新本地存储key
        if (Array.isArray(this.configColumnsKey)) { // 本地存储有对应key
          // 根据key设置columns
          let filteredColumns = []
          this.configColumnsKey.map((key, index, array) => {
            let _item = this.columns.find((item, index, array) => {
              return (item.key || item.type) === key
            })
            filteredColumns.push(_item)
          })
          this.filteredColumns = filteredColumns
        } else { // 本地存储无对应key
          this.filteredColumns = this.getTable2Columns()
        }
        console.log(this.filteredColumns, '12121')
        this.$refs['table'].$forceUpdate()
      },
      updateConfigColumnsKey () {
        this.configColumnsKey = configUtils.getColumnsKey(this.id)
        console.log(this.configColumnsKey, 'updatekey')
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
        return this.disabledSelections.includes(n)
      },
      /* 显示穿梭框 */
      showModalTransfer () {
        //rebuild dom
        let _this = this
        // this.$set(this.modalTransfer, 'exist', false)
        // this.$nextTick(() => {
          this.$set(this.modalTransfer, 'exist', true)
          this.$nextTick(() => {
            this.$set(this.modalTransfer, 'show', true)
          }, 0)
        // })
      },
      /* 保存配置 */
      saveColumnsConfig () {
        this.$refs['CTransfer'].emit() // 子给父传orderedRightData
        this.setTargetKey()
      },
      /* 获取所有的columns */
      getFullColumns () {
        this.transferData = this.changeColumns2Transfer(this.columns) // 所有columns
      },
      /* 从本地或columns获取targetkey */
      getTargetKey () {
        if (this.configColumnsKey) {
          this.targetKeys = this.configColumnsKey
        } else {
          this.targetKeys = this.changeColumns2Transfer(this.filteredColumns).map((item, index) => {
            return item.key
          })
        }
        console.log(this.targetKeys, 'tsr')
      },
      /* 将keys保存到本地存储 */
      setTargetKey () {
        let config = configUtils.getColumnsKey() || {}
        config[this.id] = this.keysToSave
        configUtils.setColumnsKey(config)
        this.fillTableColumns()
      },
      /**
       * @function 将columns数据格式转化为transfer数据格式
       * @param columns
       * @return  { key, label, disabled }
       */
      changeColumns2Transfer (data) {
        let _this = this
        let ds= this.disabledSelections
        return data.map((item, index) => {
          let _item
          _item = {
            key: _this.formatColumnsItemKey(item),
            label: _this.formatColumnsItemLabel(item) + _this.formatColumnsItemKey(item),
            disabled: ds.includes(item.key) ||  ds.includes(item.type)
          }
          return _item
        })
      },
      /* 保存keysToSave */
      handleRightDataChange (data) {
        let keysToSave = []
        data.map((item, index, array) => {
          keysToSave.push(item.key)
        })
        this.keysToSave = keysToSave
        console.log(keysToSave, 'keysTo')
      },
      /* 根据orderedRightData确定filteredColumns */
      changeTransfer2Columns (data) {
        let ds= this.disabledSelections
        let orderedColumns = []
        data.map((item, index, array) => {
          let column = this.columns.find((_item, index, array) => {
            return (_item.key || _item.type) === item.key
          })
          orderedColumns.push(column)
        })
        this.filteredColumns = orderedColumns // 被筛选的的columns
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
        if (!R.reject(this.isDisabled)(newV).length) {
          this.tableColumnsChecked = oldV
          this.$Message.warning('请至少保留一条有效列内容！')
          this.triggerClick(oldV) // 模拟触发点击（最后一个被取消的勾选恢复勾选状态）
        }
        /* 更改表格列配置 */
        if (this.isCheckMode) { // 在check模式下修改filteredColumns
          this.filteredColumns = this.getTable2Columns()
        }
      },
      'modalTransfer.show' (v) {
        if (v) {
          this.getFullColumns()
          this.getTargetKey()
        } else {
          this.$refs['CTransfer'].reset()
          this.$nextTick(() => {
            this.$set(this.modalTransfer, 'exist', false)
          })
        }
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
