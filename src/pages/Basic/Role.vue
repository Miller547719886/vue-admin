<template>
  <div class="tablePanel">
    <!-- 编辑/添加弹窗 -->
    <Modal v-model="formModal"
           :title="modalName"
           @on-cancel="cancel"
           :mask-closable="false">
      <Form ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="80">
        <Form-item label="角色名"
                   prop="name">
          <Input v-model="formValidate.name"
                 placeholder="请输入角色名"
                 :maxlength="10"
                 v-number-letter-chinese-only></Input>
        </Form-item>
        <!-- 非系统角色 -->
        <Form-item v-show="!isUpdate"
                   label="组织类型"
                   prop="organizationTypeList">
          <Select v-model="formValidate.organizationTypeList" multiple >
            <Option :value="DList.Organization.SERVICE">
              服务商
            </Option>
            <Option :value="DList.Organization.MLSALESCOMPANY">
              营销公司
            </Option>
            <Option :value="DList.Organization.AREACENTER">
              区域中心
            </Option>
            <Option :value="DList.Organization.SYSTEM">
              系统
            </Option>
          </Select>
        </Form-item>
        <Form-item label="是否启用"
                   prop="isActive">
          <Select v-model="formValidate.isActive">
            <Option :value="DList.Attribute.YES">
              启用
            </Option>
            <Option :value="DList.Attribute.NO">
              禁用
            </Option>
          </Select>
        </Form-item>
        <Form-item label="角色描述"
                   prop="desc">
          <Input type="textarea"
                 v-model="formValidate.desc"
                 :maxlength="20"
                 placeholder="请输入角色描述"></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button v-if="isUpdate"
                :loading="SubmitLoading"
                @click="updateRole('formValidate')">提交
        </Button>
        <Button v-else
                :loading="SubmitLoading"
                @click="addRole('formValidate')">提交
        </Button>
      </div>
    </Modal>
    <!-- 按钮组 -->
    <div class="mb-10">
      <Button icon="android-add"
              @click="showformModal" class="ivu-btn-default">增加
      </Button>
      <Button icon="android-remove"
              @click="updateIsDelBatch" class="ivu-btn-default">删除
      </Button>
      <!-- <Button icon="unlocked"
              @click="updateIsActiveBatch(DList.Attribute.YES)">启用
      </Button>
      <Button icon="locked"
              @click="updateIsActiveBatch(DList.Attribute.NO)">禁用
      </Button> -->
      <Button icon="android-refresh"
              @click="refresh" class="ivu-btn-default">刷新
      </Button>
    </div>
    <!-- 角色列表 -->
    <Table stripe :columns="columns"
           :data="data"
           @on-selection-change="select">
    </Table>
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
    <!-- 标签栏 -->
    <Modal v-model="roleBindAuthModal.show" :title="roleBindAuthModal.title" width="800px">
      <Tabs v-model="tabValue" @on-click="switchTab">
        <!-- 按钮列表 -->
        <Tab-pane label="按钮" icon="" name="BUTTON">
          <div class="spin-outer">
            <Button-group>
              <Button icon="android-add"
                      @click="postBindAuth('BUTTON')">解绑权限
              </Button>
              <!-- <Button icon="android-remove"
                      @click="console.log('btn table selection change')">取消
              </Button> -->
            </Button-group>
            <Button-group>
              <span style="font-size: 15px; margin-left: 20px;color: red">提示：选中的为禁用的</span>
            </Button-group>
            <Table class="mt-10" border
              :columns="columnsBtn"
              :data="dataBtn"
              @on-selection-change="selectBtn">
            </Table>
            <Page :total="totalBtn"
                  :page-size="sizeBtn"
                  show-elevator
                  @on-change="pageChangeBtn"
                  @on-page-size-change="pageSizeChangeBtn"></Page>
            <Spin size="large"
                  fix
                  v-if="authSpin"
                  class="login_loading_spin">
              <Icon type="load-c"
                    size="18"
                    class="login-spin-icon-load"></Icon>
              <div>加载中...</div>
            </Spin>
          </div>
        </Tab-pane>
        <!-- 菜单树 -->
        <Tab-pane label="菜单" icon="" name="MENU">
          <Button-group>
            <Button icon="android-add"
                    @click="postBindAuth('MENU')">绑定权限
            </Button>
            <!-- <Button icon="android-remove"
                    @click="console.log('btn table selection change')">取消
            </Button> -->
          </Button-group>
          <div class="spin-outer mt-10">
            <Tree class="mt-10"
              :data="dataMenu"
              show-checkbox
              @on-toggle-expand="toggleTree"
              @on-check-change="getCheckedIdWithoutParentMenu"
              @on-select-change="expandTree"
              ref="treeMenu"></Tree>
            <Spin size="large"
                  fix
                  v-if="authSpin"
                  class="login_loading_spin">
              <Icon type="load-c"
                    size="18"
                    class="login-spin-icon-load"></Icon>
              <div>加载中...</div>
            </Spin>
          </div>
        </Tab-pane>
        <!-- URL树 -->
        <Tab-pane label="URL" icon="" name="URL">
          <Button-group>
            <Button icon="android-add"
                    @click="postBindAuth('URL')">绑定权限
            </Button>
            <!-- <Button icon="android-remove"
                    @click="console.log('btn table selection change')">取消
            </Button> -->
          </Button-group>
          <div class="spin-outer mt-10" style="height: 400px; overflow-y: auto">
            <Tree class="mt-10"
              :data="dataURL"
              show-checkbox
              @on-toggle-expand="toggleTree"
              @on-check-change="getCheckedIdWithoutParentURL"
              @on-select-change="expandTree"
              ref="treeURL"></Tree>
            <Spin size="large"
                  fix
                  v-if="authSpin"
                  class="login_loading_spin">
              <Icon type="load-c"
                    size="18"
                    class="login-spin-icon-load"></Icon>
              <div>加载中...</div>
            </Spin>
          </div>
        </Tab-pane>
      </Tabs>
      <div slot="footer">
        <Button @click="closeRoleBindAuthModal">确认
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'Role',
    data() {
      return {
        DList,
        modalName: '增加角色',
        SubmitLoading: false,
        formModal: false,
        isUpdate: false,
        dataMenu: [],
        dataURL: [],
        authSpin: false,
        /* 树形控件单项数据结构 */
        roleBindAuthModal: {
          show: false,
          title: '角色绑定权限'
        },
        treeItem: {
          expand: false,
          disabled: false,
          disableCheckbox: false,
          title: '',
          id: null,
          parentId: null,
          children: []
        },
        /* 初始化表单数据格式 */
        initialFormValidate: {
          name: '',
          desc: '',
          organizationTypeList: [],
          isActive: DList.Attribute.YES,
        },
        /* 提交表单数据格式 */
        formValidate: {
          name: '',
          desc: '',
          organizationTypeList: [],
          isActive: DList.Attribute.YES,
        },
        /* 必填规则 */
        ruleValidate: {
          name: [
            {required: true, message: '角色名不能为空', trigger: 'blur'},
            {type: 'string', min: 1, max: 10, message: '角色名不能大于10位', trigger: 'blur'}
          ],
          desc: [
            {required: true, message: '角色描述不能为空', trigger: 'blur'},
            {type: 'string', min: 1, max: 20, message: '角色描述不能大于20字', trigger: 'change'}
          ],
          organizationTypeList: [
            {type: 'array', required: true, message: '必须选择组织类型', trigger: 'change'}
          ],
          isActive: [
            {type: 'number', required: true, message: '必须选择是否启用', trigger: 'change'}
          ]
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '描述',
            key: 'desc'
          },
          {
            title: '组织类型',
            key: 'organizationTypeList',
            render: (h, {row, column, index}) => {
              let organizationTypeList = row.organizationTypeList
              return h('div', [
                  h('span', {
                      style: {
                          marginRight: '5px',
                      },
                      // on: {
                      //     click: () => {
                      //         // this.show(params.index)
                      //     }
                      // }
                  }, this.getOrganizationNameByCode(organizationTypeList))
              ]);
            }
          },
          {
            title: '状态',
            key: 'isActive',
            render: (h, {row, column, index}) => {
                let equal = row.isActive == DList.Attribute.YES
                return h('div', [
                    h('span', {
                        class: [
                          equal ? 'ligth-blue' : 'text-red'
                        ],
                        style: {
                            marginRight: '5px',
                        },
                        // on: {
                        //     click: () => {
                        //         // this.show(params.index)
                        //     }
                        // }
                    }, equal ? '启用' : '禁用')
                ]);
            }
          },
          {
            title: '操作',
            key: 'action',
            render: (h, {row, column, index}) => {
              let id = row.id
              let equal = row.isActive == DList.Attribute.YES
              let isSysRole = row.isSysRole
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small',
                    value: ''
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      /* 弹出权限层 */
                      this.updateAuthById(id)
                    }
                  }
                }, '权限'),
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
                      equal
                        ? this.updateIsActiveById(id, DList.Attribute.NO)
                        : this.updateIsActiveById(id, DList.Attribute.YES)
                    }
                  }
                }, equal ? '禁用' : '启用'),
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
                      this.updateById(id)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    display: !isSysRole ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      this.updateIsDelById(id)
                    }
                  }
                }, '删除'),
              ]);
            }
          }
        ],
        columnsBtn: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '名称',
            key: 'name'
          }
        ],
        dataBtn: [],
        columnsURL: [],
        data: [],
        total: 0,
        page: 1,
        size: 10,
        ids: [],
        /* 按钮分页配置 */
        pageBtn: 1,
        sizeBtn: 5,
        totalBtn: 0,
        btnData: [],
        roleId: '',
        parentIdMenu: '',
        parentIdURL: '',
        indexArrMenu: [],
        indexArrURL: [],
        dataMenuPointer: [],
        dataURLPointer: [],
        bindAuthIds: [],
        idsBtn: [],
        checkedParentIdsMenu: [],
        checkedParentIdsURL: [],
        checkedIdsWithoutParentMenu: [],
        checkedIdsWithoutParentURL: [],
        tabValue: 'BUTTON'
      }
    },
    created() {
      this.refresh()
    },
    methods: {
      /* 展开 */
      expandTree (arr) {
        if (arr.length) {
          arr[0].expand = true
        }
      },
      toggleTree (node) {
        let arrow = event.currentTarget
        let text = this.getTreeTextNode(arrow)
        dom.trigger('click', text)
      },
      getTreeTextNode (node) {
        let n = node.nextSibling
        for ( ; n; n = n.nextSibling ) {
          if ( n.tagName && n.tagName === 'SPAN') {
            return n
          }
        }
      },
      closeRoleBindAuthModal () {
        this.roleBindAuthModal.show = false
      },
      /* 获取无父节点ID的数组 */
      getCheckedIdWithoutParentMenu(arr) {
        this.checkedIdsWithoutParentMenu = []
        arr.map((item) => {
          this.checkedIdsWithoutParentMenu.push(item.id)
        })
      },
      getCheckedIdWithoutParentURL(arr) {
        this.checkedIdsWithoutParentURL = []
        arr.map((item) => {
          this.checkedIdsWithoutParentURL.push(item.id)
        })
      },
      /* 切换tab触发不同请求 */
      switchTab (index) {
        switch (index) {
          case 'BUTTON':
            this.getAuthBtn(this.roleId, true)
            break
          case 'MENU':
            this.getAuthMenu(this.roleId, true)
            break
          case 'URL':
            this.getAuthURL(this.roleId, true)
            break
        }
      },
      /* 绑定权限 */
      postBindAuth (type) {
        this.bindAuthIds = []
        let data
        switch (type) {
          case 'BUTTON':
            this.bindAuthIds = this.idsBtn
            break
          case 'MENU':
            data = this.dataMenu
            // this.bindAuthIds = this.checkedIdsWithoutParentMenu
            // this.analyseIdFromTreeData(data)
            this.checkParentIsChecked(data, type)
            this.bindAuthIds = this.bottomcheckedParentIds
            // this.mergeWithParentId(this.checkedParentIdsMenu)
            break
          case 'URL':
            data = this.dataURL
            // this.bindAuthIds = this.checkedIdsWithoutParentURL
            // this.analyseIdFromTreeData(data)
            this.checkParentIsChecked(data, type)
            this.bindAuthIds = this.bottomcheckedParentIds
            // this.mergeWithParentId(this.checkedParentIdsURL)
            break
        }
        if (this.bindAuthIds.length !== 0 || (this.bindAuthIds.length === 0 && type === 'BUTTON')) {
          this.$http.post(`/user/role/rolePermission?type=${type}&roleId=${this.roleId}`, this.bindAuthIds).then(({data}) => {
            this.SubmitLoading = false
            if (data.code == $HTTP.SUCCESS) {
              // this.getAuthMenu(this.roleId, true)
              this.$Notice.success({
                title: '成功提示',
                desc: `操作成功`
              })
              // 获取第一栏
              // this.getAuthBtn(this.roleId)
            }
          }, response => {
            this.SubmitLoading = false
          })
        } else {
          this.$Notice.warning({
            title: '警告提示',
            desc: `请至少选择一项权限再点击`
          })
        }
      },
      mergeWithParentId(arr) {
        this.bindAuthIds = common.unique(this.bindAuthIds.concat(arr))
      },
      /* 从treeData中解析ID */
      analyseIdFromTreeData (data, type) {
        for (let item of data) {
          if (item.id && item.checked) {
            this.bindAuthIds.push(item.id)
          }
          if (item.children) {
            this.analyseIdFromTreeData(item.children, type)
          }
        }
      },

      /* 根据ID数组显示复选框(tree) */
      checkByBindAuthIdsTree (ids, data) {
        for (let item of data) {
          /* 对应权限ID而非资源ID */
          if (ids.indexOf(item.id) >= 0) {
            item.checked = true
          }
          if (item.children.length > 0) {
            this.checkByBindAuthIdsTree(ids, item.children)
          }
        }
      },
      /* 获取按钮权限 */
      getAuthBtn (id, reset) {
        if (reset) {
          this.dataBtn = []
        }
        let newPage = common.analysisPage(this.pageBtn)
        this.authSpin = true
        this.$http.get(`user/resource/findBtnByRoleIdAndPage?roleId=${id}&page=${newPage}&size=${this.sizeBtn}`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            console.log(data, 'btn')
            let cdata = data.data
            this.dataBtn = cdata.content
            this.totalBtn = cdata.totalElements
            this.dataBtn.map((item, index) => {
              if (item.hasBind) {
                item._checked = true
              }
            })
            this.authSpin = false
          }
        })
      },
      // 填充父节点
      findBottomChildrenWithIds (data) {
        let parentNeedCheck = false // 遍历完后判断是否需要添加父节点id
        data.map((item, index) => {
          let children = item.children
          if (children.length === 0) { // 最底部节点选中的id
            if (item.checked) {
              this.bottomcheckedParentIds.push(item.id)
              parentNeedCheck = true
            }
          } else { // 不是底部节点
            let childrenChecked = this.findBottomChildrenWithIds(children)
            if (childrenChecked) {
              this.bottomcheckedParentIds.push(item.id)
              parentNeedCheck = true
            }
          }
        })
        if (parentNeedCheck) {
          return true
        } else {
          return false
        }
      },
      checkParentIsChecked (data, type) {
        this.bottomcheckedParentIds = []
        this.checkedParentIdsMenu = []
        this.checkedParentIdsURL = []
        this.findBottomChildrenWithIds(data)
        // let id  = this.bottomcheckedParentIds[0]
        // /* 清空勾选项 */
        // let indexArr
        // // let data
        // let checkedParentIds
        // switch(type) {
        //   case 'MENU':
        //     // data = this.dataMenu
        //     indexArr = this.indexArrMenu
        //     checkedParentIds = this.checkedParentIdsMenu
        //     break
        //   case 'URL':
        //     // data = this.dataURL
        //     indexArr = this.indexArrURL
        //     checkedParentIds =
        //     this.checkedParentIdsURL = []
        //     break
        // }

        // indexArr = [] // 清空二维数组
        // this.updateIndexArr(data, id, indexArr)

        // indexArr.pop()
        // let parentNode
        // parentNode = indexArr.reduce((before, after, afterIndex) => {
        //   if (afterIndex === indexArr.length - 1) {
        //     return before[after]
        //   } else {
        //     return before[after].children
        //   }
        // }, data)
        // if (indexArr.length === 0) {
        //   //todo
        // } else {
        //   parentNode.children.map((item, index) => {
        //       if (item.checked) {
        //         indexArr.reduce((before, after, afterIndex) => {
        //           checkedParentIds.push(before[after].id)
        //           if (afterIndex === indexArr.length - 1) {
        //             return before[after]
        //           } else {
        //             return before[after].children
        //           }
        //         }, data)
        //       }
        //   })
        // }
      },
      // 根据获取组织类型代码获取组织类型名称
      getOrganizationNameByCode (codeArr) {
        let oType = {
          'AREACENTER': '区域中心',
          'MLSALESCOMPANY': '营销公司',
          'SERVICE': '服务商',
          'SYSTEM': '系统'
        }
        let oTypeName = codeArr.map((o) => {
          return oType[o]
        })
        return oTypeName.join(' ')
      },
      checkTreeChangeURL (arr) {
        let id = arr.id
        this.indexArrURL = []
        this.updateIndexArr(this.dataURL, this.parentIdURL, this.indexArrURL)
        console.log(this.indexArrURL)
      },
      /* 筛选用户绑定权限 */
      filterTable (total, bind) {
        let ids = bind.map((item, index) => {
          return item.permission.id
        })
        this.checkByBindAuthIdsTable(ids, total)
      },
      /* 根据ID数组显示复选框(table) */
      checkByBindAuthIdsTable (ids, data) {
        for (let item of data) {
          /* 对应权限ID而非资源ID */
          if (ids.indexOf(item.permission.id) >= 0) {
            Object.assign(item, { _checked: true })
          }
        }
        /* 重新渲染table(实现勾选效果) */
        this.dataBtn = JSON.parse(JSON.stringify(data))
      },
      /**
       * 获取子节点数据(menu)
       * @param arr 节点对应列表
       */
      getChildMenu (arr) {
        if (arr[0] && arr[0].children.length === 0) {
          let roleId = this.roleId
          /* 选中节点id */
          this.parentIdMenu = arr[0].id
          /* 清空指针数组 */
          this.indexArrMenu = []
          this.updateIndexArr(this.dataMenu, this.parentIdMenu, this.indexArrMenu)
          // let index = this.dataURLPointer.indexOf(arr[0])
          // /* 层级数组添加index */
          // this.indexArrURL.push(index)
          this.getAuthMenu(true)
        } else {
          console.log('已经请求过该节点下的data了！')
        }
      },
      /**
       * 获取子节点数据(url)
       * @param arr 节点对应列表
       */
      getChildURL (arr) {
        if (arr[0] && arr[0].children.length === 0) {
          let roleId = this.roleId
          /* 选中节点id */
          this.parentIdURL = arr[0].id
          /* 清空指针数组 */
          this.indexArrURL = []
          this.updateIndexArr(this.dataURL, this.parentIdURL, this.indexArrURL)
          // let index = this.dataURLPointer.indexOf(arr[0])
          // /* 层级数组添加index */
          // this.indexArrURL.push(index)
          this.getAuthURL(true)
        } else {
          console.log('已经请求过该节点下的data了！')
        }
      },
      /**
       * 更新当前级别指针数组
       * @param arr 节点对应列表
       * @param id 根据id判断指针数组指向位置
       * @param type 指针数组类型
       */
      updateIndexArr (arr, id, indexArr) {
        // debugger
        console.log(arr, 'arr')
        for (let item of arr) {
          let index = arr.indexOf(item)
          indexArr.push(index)
          if (item.id === id) {
            /* 找到id */
            return true
          } else {
            if (item.children.length > 0) {
              // pointer += 1
              /* 找不到id，有子对象 */
              if (this.updateIndexArr(item.children, id, indexArr)) {
                return true
              } else {
                indexArr.reverse().splice(0, 1)
                indexArr.reverse()
              }
            } else {
              /* 找不到id，没有子对象 */
              indexArr.reverse().splice(0, 1)
              indexArr.reverse()
            }
          }
        }
      },
      /**
       * 返回所有权限树形结构(一次性处理单级数据)
       * @param data 待处理数据列表
       * @param treeData tree数据列表
       */
      data2Tree (data, treeData, type) {
        let _this = this
        let list = []
        let indexArr = []
        switch (type) {
          case 'MENU':
            indexArr = this.indexArrMenu
            break
          case 'URL':
            indexArr = this.indexArrURL
            break
        }
        for (let i in data) {
          var item = data[i]
          var _item = JSON.parse(JSON.stringify(this.treeItem))
          _item.title = item.name/*  + item.id */
          _item.parentId = item.parentId
          _item.id = item.id
          _item.children = []
          /* 只对最后一级进行绑定 */
          if (item.children && item.children.length === 0) {
            _item.checked = item.hasBind
          }

          /* 一次性获取多级数据时执行下面方法 */
          if (item.children && item.children.length > 0) {
            let childList = item.children
            _this.data2Tree(childList, _item.children)
          }

          list.push(_item)
        }
        _this.pushTreeData(treeData, list, indexArr, type)
      },
      /**
       * 返回所有权限树形结构(一次性处理所有数据)
       * @param data 待处理数据列表
       * @param treeData tree数据列表
       */
      dataToTree (data, treeData, type) {
        let _this = this
        let list = []
        let indexArr = []
        switch (type) {
          case 'MENU':
            indexArr = this.indexArrMenu
            break
          case 'URL':
            indexArr = this.indexArrURL
            break
        }

      },
      /**
       * 填充树形结构
       * @param data 数据列表
       * @param _item 填充内容
       * @param indexArr 填充层级
       */
      pushTreeData (data, list, indexArr, type) {
        let parentNodeChildren = []
        let parentNode
        if (indexArr.length > 0) {
          parentNodeChildren = indexArr.reduce((before, after, afterIndex) => {
            return before[after].children
          }, data)
          parentNode = indexArr.reduce((before, after, afterIndex) => {
            if (afterIndex === indexArr.length - 1) {
              return before[after]
            } else {
              return before[after].children
            }
          }, data)
          parentNodeChildren.push(...list)
          this.$set(parentNode, 'children', ...list)
          parentNode.expand = true
        } else {
          data.push(...list)
        }
      },
      /* 筛选用户绑定权限(tree) */
      filterTree (total, bind) {
        let ids = bind.map((item, index) => {
          return item.permission.id
        })
        this.checkByBindAuthIdsTree(ids, total)
      },
      // 合并名称与描述
      mergeNameWithDesc (data) {
        for (let item of data) {
          if (item.permission.desc) {
            item.name += `(${item.permission.desc})`
          }
          if (item.children.length) {
            this.mergeNameWithDesc(item.children)
          }
        }
      },
      /* 获取菜单权限 */
      getAuthMenu (id, reset) {
        let _this = this
        let type = 'MENU'
        /* 清空menu相关数据 */
        if (reset) {
          this.dataMenu = []
          this.parentIdMenu = ''
          this.indexArrMenu = []
          this.dataMenuPointer = []
        }
        this.authSpin = true
        this.$http.get(`user/resource/findByTypeAndParentIdAndRoleId?type=${type}&roleId=${id}`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            let cdata = data.data
            this.mergeNameWithDesc(cdata)
            console.log(cdata, 'menu')
            /* 若返回有值 */
            if (cdata.length > 0) {
              /* data转树形数据结构 */
              this.data2Tree(cdata, this.dataMenu, type)
            } else {
              console.log('无子级树！')
            }
            this.authSpin = false
          }
        })
      },
      /* 获取URL权限 */
      getAuthURL (id, reset) {
        let _this = this

        let type = 'URL'
        /* 清空url相关数据 */
        if (reset) {
          this.dataURL = []
          this.parentIdURL = ''
          this.indexArrURL = []
          this.dataURLPointer = []
        }
        this.authSpin = true
        this.$http.get(`user/resource/findByTypeAndParentIdAndRoleId?type=${type}&roleId=${id}`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            let cdata = data.data
            this.mergeNameWithDesc(cdata)
            /* 若返回有值 */
            console.log(cdata, 'menu')
            if (cdata.length > 0) {
              /* data转树形数据结构 */
              this.data2Tree(cdata, this.dataURL, type)
            } else {
              console.log('无子级树！')
            }
            this.authSpin = false
          }
        })
      },
      /* 加载第一页表格 */
      refresh() {
        this.load(1, 10)
      },
      /* 加载第n页请求 */
      load(page, size) {
        this.ids = []
        // this.data = []
        let newPage = common.analysisPage(page)
        this.$http.get(`/user/role/roleListByPage?page=${newPage}&size=${size}`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            let cdata = data.data
            this.data = cdata.content
            this.total = cdata.totalElements
          }
        })
      },
      /* 调用加载第n页方法 */
      pageChange(page) {
        this.page = page;
        this.load(this.page, this.size)
      },
      pageChangeBtn(page) {
        this.pageBtn = page;
        this.getAuthBtn(this.roleId, true)
      },
      /* 改变页面容量，重新加载 */
      pageSizeChange(size) {
        this.size = size
        this.load(this.page, this.size)
      },
      pageSizeChangeBtn(size) {
        this.size = size
        this.getAuthBtn(this.roleId, true)
      },
      /* 得到每页权限ID数据 */
      selectBtn(data) {
        this.idsBtn = common.getColumnData(data, 'id')
      },
      /* 得到每页数据 */
      select(data) {
        this.ids = common.getColumnData(data, 'id')
      },
      /* 加载前先重置数据 */
      cancel() {
        this.handleReset('formValidate')
        setTimeout(() => {
          this.formValidate = this.initialFormValidate
          this.SubmitLoading = false
          this.isUpdate = false
        }, 500)
      },
      /* vue方法清除数据 */
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      /* 显示增加角色|编辑角色弹窗 */
      showformModal() {
        this.modalName = '增加角色'
        this.formModal = true
      },
      /* 添加角色请求 */
      addRole(name) {
        common.clearString(this.formValidate, ['name', 'desc'])
        this.SubmitLoading = true;
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post('/user/role/addRole', this.formValidate).then(({data}) => {
              this.SubmitLoading = false
              if (data.code == $HTTP.SUCCESS) {
                this.formModal = false
                this.cancel()
                this.load(this.page, this.size)
                this.$Notice.success({
                  title: '成功提示',
                  desc: `添加角色成功`
                })
              }
            }, response => {
              this.SubmitLoading = false
            })
          } else {
            this.SubmitLoading = false;
            this.$Message.error('请检查参数是否填写正确失败!')
          }
        })
      },
      /* 编辑角色请求 */
      updateRole(name) {
        common.clearString(this.formValidate, ['name', 'desc'])
        this.SubmitLoading = true;
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post('/user/role/updateRole', this.formValidate).then(({data}) => {
              this.SubmitLoading = false
              if (data.code == $HTTP.SUCCESS) {
                this.formModal = false
                this.cancel()
                this.load(this.page, this.size)
                this.$Notice.success({
                  title: '成功提示',
                  desc: `修改角色成功`
                })
              }
            }, response => {
              this.SubmitLoading = false
            })
          } else {
            this.SubmitLoading = false;
            this.$Message.error('请检查参数是否填写正确失败!')
          }
        })
      },
      updateById(id) {
        this.modalName = '修改角色'
        this.isUpdate = true
        this.$http.get(`/user/role/findById?id=${id}`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.formModal = true
            this.formValidate = data.data
          }
        })
      },
      /* 删除数据 */
      updateIsDel(ids) {
        // let idsJson = JSON.stringify({ ids })
        this.$http.post(`/user/role/deleteRole`, ids, {
          headers: {
            'content-type': 'application/json;charset=UTF-8'
          }
        }).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.$Modal.remove()
            this.load(this.page, this.size)
            this.$Notice.success({
              title: '成功提示',
              desc: `删除角色成功`
            })
          }
        })
      },
      /* 启用或者禁用请求 */
      updateIsActive(id, isActive) {
        let idJson = JSON.stringify({id})
        this.$http.post(`/user/role/changeRoleActive`, id, {
          headers: {
            'content-type': 'application/json;charset=UTF-8'
          }
        }).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.$Modal.remove()
            this.load(this.page, this.size)
            this.$Notice.success({
              title: '成功提示',
              desc: DList.Attribute.YES == isActive ? `启用角色成功` : `禁用角色成功`
            })
          }
        })
      },
      /* 权限 */
      updateAuthById(id) {
        this.roleId = id
        this.roleBindAuthModal.show = true
        // 渲染第一栏
        this.getAuthBtn(id)
      },
      updateIsActiveById(id, isActive) {
        let ids = [id]
        let message
        if (DList.Attribute.YES == isActive) {
          message = '确认要启用角色吗？'
        } else {
          message = '确认要禁用角色吗？'
        }
        this.$Modal.confirm({
          title: '确认提示',
          content: message,
          loading: true,
          onOk: () => {
            this.updateIsActive(id, isActive)
          }
        })
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
          }
        })
      },
      updateIsActiveBatch(isActive) {
        if (this.ids.length == 0) {
          this.$Notice.error({
            title: '警告提示',
            desc: `请至少选择一条数据`
          })
        } else {
          let message
          if (DList.Attribute.YES == isActive) {
            message = '确认要启用角色吗？'
          } else {
            message = '确认要禁用角色吗？'
          }
          this.$Modal.confirm({
            title: '确认提示',
            content: message,
            loading: true,
            onOk: () => {
              this.updateIsActive(this.ids, isActive)
            }
          })
        }
      },
      updateIsDelBatch() {
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
            }
          })
        }
      }
    },
    watch: {
      'roleBindAuthModal.show' (val) {
        if (val === true) {
          this.tabValue = 'BUTTON'
        }
      }
    }
  }
</script>
