<template>
  <!-- 分页筛选表格 -->
  <div class="page-table">
    <FilterTable ref="FilterTable"
          :id="id"
          :mode="mode"
          :export-excel="exportExcel"
          :columns="columns"
          :data="data"
          @on-total-change="setTotal"
          @on-selection-change="emitSelectionChange"
          @on-current-change="emitCurrentChange"
          >
    </FilterTable>
    <!-- 分页 -->
    <div class="clearfix"
        :style="setPagePosition()">
      <Page ref="page" style="float: none; display: inline-block"
        :total="total"
        :page-size="size"
        show-elevator
        :show-sizer="showSizer"
        show-total
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"></Page>
    </div>
  </div>
</template>

<script>
  /**
   * @prop [columns] 表格列配置
   * @prop [showSizer] 是否配置每页项目数（弹窗内分页表格注意配置此项为false，其他分页表格可不选）
   * 调用方法：
   *   父组件中 ---
   *   this.$refs['MyPageTable'].load({
   *     url: 'xxx',
   *     params: {
   *       id: 1000,
   *       page: 1,
   *       size: 10
   *     }
   *   })
   * ps：父组件调用方法本组件方法不能在created中调用,要在mounted中调用！（因为未挂载到dom上，检测不到ref）
   */
  import FilterTable from './FilterTable'
  export default {
    name: 'PageTable',
    components: {
      FilterTable
    },
    data () {
      return {
        columnsHeader: [],
        tableColumnsChecked: [],
        size: 10,
        page: 1,
        total: 0,
        data: [],
        url: '',
        params: {},
        cb: null,
        forceUpdateSign: {
          flag: false,
          page: 0
        }
      }
    },
    props: {
      pagePosition: {
        type: String,
        require: false,
        default: 'right' // 'left', 'middle', 'right'
      },
      id: {
        type: String,
        require: true,
        default: ''
      },
      columns: {
        type: Array,
        require: true,
        default: () => []
      },
      showSizer: {
        type: Boolean,
        require: true,
        default: true
      },
      mode: {
        type: String,
        require: false,
        default: 'transfer' // check transfer
      },
      exportExcel: {
        type: Boolean,
        require: false,
        default: false
      },
      context: Object
    },
    mounted () {
    },
    methods: {
      setPagePosition() {
        let _style
        switch (this.pagePosition) {
          case 'right':
            // _style = { 'float': 'right' }
            _style = { 'textAlign': 'right' }
            break
          case 'middle':
            // _style = { 'margin': '0 auto', 'float': 'none' }
            _style = { 'textAlign': 'center' }
            break
          case 'left':
            // _style = { 'float': 'left' }
            _style = { 'textAlign': 'right' }
            break
        }
        return _style
      },
      /* 调用加载第n页方法 */
      pageChange(page) {
        this.page = page;
        this.load()
      },
      /* 改变页面容量，重新加载 */
      pageSizeChange(size) {
        this.size = size
        this.load()
      },
      setTotal (val) {
        this.total = val
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
      switchSign(page) {
        this.forceUpdateSign.flag = !this.forceUpdateSign.flag
        this.forceUpdateSign.page = page
      },
      /**
       * 加载第n页请求
       * @param page 页码 1
       * @param size 每页项目数 10
       * @param url 请求url ``
       * @param params 参数 ``
       */
      load(config, cb) {
        if (config) {
          if (config.url) {
            this.url = config.url
          }
          if (config.params) {
            this.params = config.params

            /* 有效的page和size才会被使用 */
            if (config.params.page != undefined) {
              this.page = config.params.page
              this.switchSign(config.params.page)
            }
            if (config.params.size != undefined) {
              this.size = config.params.size
            }
          }
        }
        if (cb) {
          this.cb = cb
        }
        this.$refs['FilterTable'].load({
          url: this.url,
          params: this.params,
          page: this.page,
          size: this.size
        }, this.cb)
      },
      /* 选中ids */
      emitSelectionChange (ids) {
        this.$emit('on-selection-change', ids)
      },
      emitCurrentChange (currentRow, oldCurrentRow) {
        this.$emit('on-current-change', currentRow, oldCurrentRow)
      }
      /**
       * todo 转发table监听的event：
       * on-select
       * on-select-cancel
       * on-select-all
       * on-sort-change
       * on-row-click
       * on-row-dblclick
       * on-expand
       */
    },
    watch: {
      'forceUpdateSign.flag' (v) {
        let VMPage = this.$refs['page']
        VMPage.currentPage = this.forceUpdateSign.page
        VMPage.$forceUpdate()
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
