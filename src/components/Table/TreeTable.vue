<template>
  <div class="multi-level-table">
    <Checkbox-group ref="checkList"
      v-model="tableColumnsChecked"
      @on-change="changeTableColumns"
      @on-current-change="CurrentChange"
      @on-select="Select"
      @on-select-cancel="SelectCancel"
      @on-select-all="SelectAll"
      @on-selection-change="SelectionChange"
      @on-sort-change="SortChange"
      @on-row-click="RowClick"
      @on-row-dblclick="RowDblclick"
      @on-expand="Expand">
      <Checkbox
        v-for="(item, index) in checkList"
        :disabled="checkDisabled(item)"
        :label="item" :key="item"></Checkbox>
    </Checkbox-group>
    <div class="ivu-table-wrapper mt-10">
      <div class="ivu-table">
        <div class="ivu-table-header">
          <table cellspacing="0"
                cellpadding="0"
                border="0"
                style="width: 100%;">
            <thead>
            <tr>
              <th v-for="column in filteredColumns"
                  :style="{width:column.width==null?'auto':column.width+'px'}">
                <div class="ivu-table-cell"><span>{{column.title}}</span>
                </div>
              </th>
            </tr>
            </thead>
          </table>
        </div>
        <div class="ivu-table-body">
          <table cellspacing="0"
                cellpadding="0"
                border="0"
                style="width: 100%;">
            <tbody class="ivu-table-tbody">
            <template v-if="data.length>0"
                      v-for="row in data">
              <tr class="ivu-table-row tree-level-1" :id="row.id" @mouseover="rowMouseover" @mouseleave="rowMouseleave" >
                <td v-for="column in filteredColumns"
                    :style="{width:column.width==null?'auto':column.width+'px'}">
                  <div class="ivu-table-cell">
                    <div v-if="!column.render">
                      <Button :icon="isExpand(row)"
                              size="small"
                              v-if="((row.children.length>0 && column.tree) || (row.hasChildren && column.tree))"
                              @click.stop.prevent="expand(row,$event)"></Button>
                      <Button :icon="isExpand(row)"
                              size="small"
                              v-if="(row.children.length==0 && column.tree && !row.hasChildren)"
                              style="visibility:hidden"></Button>
                      {{row[column.key]}}
                    </div>
                    <div v-else>
                      <TreeTableCell :context="context"
                                    :row="row"
                                    :column="column"
                                    :index="1"></TreeTableCell>
                    </div>
                  </div>
                </td>
              </tr>
              <template v-if="row.expand"
                        v-for="row1 in row.children">
                <tr class="ivu-table-row tree-level-2" :id="row1.id" @mouseover="rowMouseover" @mouseleave="rowMouseleave" >
                  <td v-for="column in filteredColumns">
                    <div class="ivu-table-cell">
                      <div v-if="!column.render">
                        <Button :icon="isExpand(row1)"
                                size="small"
                                v-if="(row1.children.length>0 && column.tree) || (row1.hasChildren && column.tree)"
                                @click.stop.prevent="expand(row1,$event)"
                                style="margin-left:10px"></Button>
                        <Button :icon="isExpand(row1)"
                                size="small"
                                v-if="(row1.children.length==0 && column.tree && !row1.hasChildren)"
                                style="visibility:hidden;margin-left:10px"></Button>
                        {{row1[column.key]}}
                      </div>
                      <div v-else>
                        <TreeTableCell :context="context"
                                      :row="row1"
                                      :column="column"
                                      :index="2"></TreeTableCell>
                      </div>
                    </div>
                  </td>
                </tr>
                <template v-if="row1.expand"
                          v-for="row2 in row1.children">
                  <tr class="ivu-table-row tree-level-3" :id="row2.id" @mouseover="rowMouseover" @mouseleave="rowMouseleave" >
                    <td v-for="column in filteredColumns">
                      <div class="ivu-table-cell">
                        <div v-if="!column.render">
                          <Button :icon="isExpand(row2)"
                                  size="small"
                                  v-if="(row2.children.length>0 && column.tree) || (row2.hasChildren && column.tree)"
                                  @click.stop.prevent="expand(row2,$event)"
                                  style="margin-left:20px"></Button>
                          <Button :icon="isExpand(row2)"
                                  size="small"
                                  v-if="(row2.children.length==0 && column.tree && !row2.hasChildren)"
                                  style="visibility:hidden;margin-left:20px"></Button>
                          {{row2[column.key]}}
                        </div>
                        <div v-else>
                          <TreeTableCell :context="context"
                                        :row="row2"
                                        :column="column"
                                        :index="3"></TreeTableCell>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <template v-if="row2.expand"
                            v-for="row3 in row2.children">
                    <tr class="ivu-table-row tree-level-4" :id="row3.id" @mouseover="rowMouseover" @mouseleave="rowMouseleave" >
                      <td v-for="column in filteredColumns">
                        <div class="ivu-table-cell">
                          <div v-if="!column.render">
                            <Button :icon="isExpand(row3)"
                                    size="small"
                                    v-if="(row3.children.length>0 && column.tree) || (row3.hasChildren && column.tree)"
                                    @click.stop.prevent="expand(row3,$event)"
                                    style="margin-left:30px"></Button>
                            <Button :icon="isExpand(row3)"
                                    size="small"
                                    v-if="(row3.children.length==0 && column.tree && !row3.hasChildren)"
                                    style="visibility:hidden;margin-left:30px"></Button>
                            {{row3[column.key]}}
                          </div>
                          <div v-else>
                            <TreeTableCell :context="context"
                                          :row="row3"
                                          :column="column"
                                          :index="4"></TreeTableCell>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <template v-if="row3.expand"
                              v-for="row4 in row3.children">
                      <tr class="ivu-table-row tree-level-5" :id="row4.id" @mouseover="rowMouseover" @mouseleave="rowMouseleave" >
                        <td v-for="column in filteredColumns">
                          <div class="ivu-table-cell">
                            <div v-if="!column.render">
                              <Button :icon="isExpand(row4)"
                                      size="small"
                                      v-if="(row4.children.length>0 && column.tree) || (row4.hasChildren && column.tree)"
                                      @click.stop.prevent="expand(row4,$event)"
                                      style="margin-left:40px"></Button>
                              <Button :icon="isExpand(row4)"
                                      size="small"
                                      v-if="(row4.children.length==0 && column.tree && !row4.hasChildren)"
                                      style="visibility:hidden;margin-left:40px"></Button>
                              {{row4[column.key]}}
                            </div>
                            <div v-else>
                              <TreeTableCell :context="context"
                                            :row="row4"
                                            :column="column"
                                            :index="5"></TreeTableCell>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </template>
                </template>
              </template>
            </template>
            <tr v-if="data.length==0">
              <td style="text-align:center"><span>暂无数据</span></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import TreeTableCell from './TreeTableCell'
  export default {
    name: 'TreeTable',
    data () {
      return {
        selectedArr: null,
        filteredColumns: [],
        tableColumnsChecked: [],
      }
    },
    components: {
      TreeTableCell
    },
    props: {
      columns: {
        type: Array,
        require: true
      },
      data: {
        type: Array,
        require: true
      },
      context: Object
    },
    methods: {
      isExpand(row) {
        return row.expand ? 'android-remove' : 'android-add'
      },
      rowMouseover (e) {
        e.currentTarget.classList.add('ivu-table-row-hover')
      },
      rowMouseleave (e) {
        e.currentTarget.classList.remove('ivu-table-row-hover')
      },
      // 点击展开按钮时触发
      expand(row, $event) {
        console.log(1212)
        this.selectedArr = [row]
        // this.$emit('tree-level-select', this.selectedArr)
        // 数组的变化需要Vue.set才能重新渲染
        Vue.set(row,"expand",!row.expand);
        let el = $event.target.tagName == 'I' ? $event.target : $event.target.querySelectorAll('i')[0];
        // 加减符号切换
        if (row.expand) {
          el.classList.remove('ivu-icon-android-add');
          el.classList.add('ivu-icon-android-remove');
        } else {
          el.classList.remove('ivu-icon-android-remove');
          el.classList.add('ivu-icon-android-add');
        }
      },
      checkDisabled (item) {
        if (item === '多选') {
          return true
        }
      },
      /* 获取处理后表格列 */
      getTable2Columns () {
        /* 复制表格列副本 */
        const fullColumns = common.fullCopyObj(this.columns)
        /* 初始化筛选table columns */
        let columns = []
        fullColumns.forEach((item) => {
          if (this.tableColumnsChecked.includes('多选')) {
            if (item.type === 'selection') {
              columns.push(item)
            }
          }
          if (this.tableColumnsChecked.includes(item.title)) {
            columns.push(item)
          }
        })
        /* 返回table columns */
        return columns
      },
      changeTableColumns (msg) {

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
    },
    computed: {
      checkList () {
        let list = Object.values(this.columns).map((item) => (item.title || (item.type === 'selection' ? '多选' : '--')))
        /* 初始化被勾选项目为全部 */
        this.tableColumnsChecked = list
        return list
      }
    },
    watch: {
      /* 监听checkbox变化 */
      tableColumnsChecked (newV, oldV) {
        /* 如果只存在‘多选’勾选项或者不存在任何勾选项 */
        if ((newV.includes('多选') && newV.length === 1) || !newV.length) {
          this.tableColumnsChecked = oldV
          this.$Message.warning('请至少保留一条有效列内容！')
        }
        /* 更改表格列配置 */
        this.filteredColumns = this.getTable2Columns()
      }
    }
  }
</script>
<style>
</style>
