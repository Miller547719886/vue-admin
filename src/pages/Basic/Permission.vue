<template>
  <div class="tablePanel">
    <!-- 编辑/添加弹窗 -->
    <Modal v-model="formModal"
           :title="modalName"
           @on-cancel="cancel"
           :mask-closable="false">
      <!-- 弹窗表格 -->
      <Form ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="80">
        <Form-item label="名称"
                   prop="name">
          <Input v-model="formValidate.name"
                 placeholder="请输入名称"
                 :maxlength="50"
                 v-number-letter-chinese-only></Input>
        </Form-item>
        <Form-item label="类型"
                   prop="type">
          <Select :disabled="isTypeDisabled"
                  v-model="formValidate.type">
            <Option :value="authType.BUTTON">
              按钮
            </Option>
            <Option :value="authType.MENU">
              菜单
            </Option>
            <Option :value="authType.URL">
              URL
            </Option>
          </Select>
        </Form-item>
        <!-- 当类型为菜单时显示 -->
        <Form-item v-if="(formValidate.type === 'MENU')"
                   label="图标样式"
                   prop="icon">
          <Select v-model="formValidate.icon">
            <Option v-for="item in icon"
                    :value="item"
                    :label="item"
                    :key="item">
              <span><Icon :type="item"></Icon></span>
              <span style="float:right;">{{item}}</span>
            </Option>
          </Select>
        </Form-item>
        <Form-item label="链接"
                   prop="link">
          <Input type="text" v-model="formValidate.link"
                 placeholder="请输入链接"
                 :maxlength="100"></Input>
        </Form-item>
        <Form-item label="key"
                   prop="key">
          <Input v-model="formValidate.key"
                 placeholder=""
                 :maxlength="100"></Input>
        </Form-item>
        <Form-item label="排序"
                   prop="sort">
          <Input-number :min="1"
                        :step="1"
                        v-model="formValidate.sort"></Input-number>
        </Form-item>
        <Form-item label="描述"
                   prop="desc">
          <Input v-model="formValidate.desc"
                 placeholder=""
                 :maxlength="20"></Input>
        </Form-item>
        <Form-item label="状态"
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
      </Form>
      <!-- 弹窗提交按钮 -->
      <div slot="footer">
        <Button v-if="isUpdate"
                :loading="SubmitLoading"
                @click="updateAuth('formValidate', formValidate.type)">提交
        </Button>
        <Button v-else
                :loading="SubmitLoading"
                @click="addAuth('formValidate', formValidate.type)">提交
        </Button>
      </div>
    </Modal>
    <!-- 按钮组 -->
    <div class="mb-10 d-ib">
      <Button icon="android-add"
              @click="addTopAuth" class="ivu-btn-default">增加
      </Button>
      <Button icon="android-remove"
              @click="updateIsDelBatch" class="ivu-btn-default">删除
      </Button>
      <Button icon="android-refresh"
              @click="refresh" class="ivu-btn-default">刷新
      </Button>
    </div>
    <!-- 标签栏 -->
    <Tabs v-model="tabValue" @on-click="switchTab"
          :style="{'min-height': '400px'}">
      <!-- 按钮列表 -->
      <Tab-pane name="BUTTON" label="按钮" icon="">
        <div class="spin-outer">
          <PageTable :showSizer="false" ref="TableBtn"
            :columns="columnsBtn"
            @on-selection-change="selectBtn">
          </PageTable>
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
      <Tab-pane name="MENU" label="菜单" icon="">
        <div class="spin-outer">
          <TreeTable :data="dataMenu"
                     :columns="columnsMenu"
                     :context="contextMenu"
                     @tree-level-select="getChildMenu"
                     ref="MENU"></TreeTable>
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
      <Tab-pane name="URL" label="URL" icon="">
        <div class="spin-outer">
          <TreeTable :data="dataURL"
                     :columns="columnsURL"
                     :context="contextURL"
                     @tree-level-select="getChildURL"
                     ref="URL"></TreeTable>
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
  </div>
</template>

<script>
  import PageTable from '@/components/Table/PageTable'
  export default {
    name: 'Role',
    components: {
      PageTable
    },
    data() {
      return {
        DList,
        modalName: '增加权限',
        isTypeDisabled: false,
        SubmitLoading: false,
        formModal: false,
        tabShow: false,
        isUpdate: false,
        authSpin: false,
        /* tab指向 */
        tabValue: 'BUTTON',
        /* 权限类型 */
        authType: {
          BUTTON: 'BUTTON',
          MENU: 'MENU',
          URL: 'URL'
        },
        icon: [
          'android-people',
          'android-settings',
          'android-contact',
          'android-mail',
          'android-send',
          'android-delete',
          'android-globe',
          'android-chat',
          'android-desktop',
          'android-cloud-outline',
          'android-cloud',
          'android-download',
          'android-upload',
          'android-image',
          'android-microphone',
          'android-favorite',
          'android-cart',
          'ionic',
        ],
        /* 初始化表单格式 */
        initialFormValidate: {
          name: '',
          type: '',
          link: '',
          key: '',
          sort: 1,
          icon: '',
          desc: '',
          isActive: DList.Attribute.YES,
          parentId: null
        },
        /* 表单格式 */
        formValidate: {
          name: '',
          type: '',
          link: '',
          icon: '',
          key: '',
          sort: 1,
          desc: '',
          isActive: DList.Attribute.YES,
          parentId: null
        },
        /* 必填规则 */
        ruleValidate: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
            {type: 'string', min: 1, max: 50, message: '名称最大长度为50个字符', trigger: 'blur'}
          ],
          type: [
            {required: true, type: 'string', message: '必须选择权限类型', trigger: 'blur'}
          ],
          link: [
            {required: true, message: '链接不能为空', trigger: 'blur'},
            {type: 'string', min: 1, max: 100, message: '链接最大长度为100字符', trigger: 'blur'}
          ],
          key: [
            {type: "string", message: '可选择是否填写key', trigger: 'blur'}
          ],
          sort: [
            {type: "number", min: 1, required: true, message: '排序必须为数字', trigger: 'blur'}
          ],
          desc: [
            {type: 'string', message: '可选择是否填写描述', trigger: 'change'}
          ],
          isActive: [
            {type: 'number', required: true, message: '必须选择是否启用', trigger: 'change'}
          ]
        },
        /* 树形控件单项数据结构 */
        treeItem: {
          expand: false,
          disabled: false,
          isParent: false,
          disableCheckbox: false,
          title: '',
          id: null,
          parentId: null,
          children: []
        },
        columnsBtn: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '名称',
            key: 'name',
            tree: true
          },
          // {
          //   title: '类型',
          //   key: 'type'
          // },
          {
            title: '链接地址',
            key: 'link'
          },
          {
            title: '排序',
            key: 'sort'
          },
          {
            title: '状态',
            key: 'isActive',
            render: (h, {row, column, index}) => {
                let equal = row.isActive == DList.Attribute.YES
                return h('div', [
                    h('span', {
                        class: [
                          equal ? 'text-green' : 'text-red'
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
            title: '描述',
            key: 'desc'
          },
          {
            title: '操作',
            key: 'action',
            render: (h, {row, column, index}) => {
              let id = row.id
              let equal = row.isActive == DList.Attribute.YES
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
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.updateIsDelById(id)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        /* btn table数据 */
        dataBtn: [],
        /* MENU table数据 */
        dataMenu: [],
        columnsMenu: [
          // {
          //   type: 'selection',
          //   width: 60,
          //   align: 'center'
          // },
          {
            title: '名称',
            key: 'name',
            tree: true
          },
          {
            title: '图标样式名',
            key: 'icon',
            render(row, column) {
              if (row.icon) {
                return `<Icon type="${row.icon}" size="14"></Icon> <span>${row.icon}</span>`
              }
              return ''
            }
          },
          // {
          //   title: '类型',
          //   key: 'type'
          // },
          {
            title: '链接地址',
            key: 'link'
          },
          // {
          //   title: '排序',
          //   key: 'sort'
          // },
          {
            title: '状态',
            key: 'isActive',
            render (row, column, index) {
              let equal = row.isActive == DList.Attribute.YES
              if (equal) {
                return `<span class="text-green" style="marginRight: 5px">启用</span>`
              } else {
                return `<span class="text-red" style="marginRight: 5px">禁用</span>`
              }
            }
          },
          // {
          //   title: '描述',
          //   key: 'desc'
          // },
          {
            title: '操作',
            key: 'action',
            render (row, column, index) {
              let id = row.id
              let childrenLength = row.children.length
              let button = ''
              /* 菜单为三级tree */
              // if (row.children.length === 0) {
              //   button += `<i-button type="text" size="small" @click="updateById(${id})">编辑</i-button>`
              //   button += `<i-button type="text" size="small" @click="updateIsDelById(${id}, ${childrenLength})">删除</i-button>`
              //   return button
              // } else {
                button = `<i-button type= "text" size= "small" @click.stop.prevent="addChild(${id}, 'MENU')">增加子菜单</i-button>`
                // button += append
                button += `<i-button type= "text" size= "small" @click.stop.prevent="updateById(${id})">编辑</i-button>
                           <i-button type= "text" size= "small" @click.stop.prevent="updateIsDelById(${id}, ${childrenLength})">删除</i-button>`
                return button
              // }
            }
          }
        ],
        contextMenu: this,
        /* URL table数据 */
        dataURL: [],
        columnsURL: [
          // {
          //   type: 'selection',
          //   width: 60,
          //   align: 'center'
          // },
          {
            title: '名称',
            key: 'name',
            tree: true
          },
          // {
          //   title: '类型',
          //   key: 'type'
          // },
          {
            title: '链接地址',
            key: 'link'
          },
          // {
          //   title: '排序',
          //   key: 'sort'
          // },
          {
            title: '状态',
            key: 'isActive',
            render (row, column, index) {
              let equal = row.isActive == DList.Attribute.YES
              if (equal) {
                return `<span class="text-green" style="marginRight: 5px">启用</span>`
              } else {
                return `<span class="text-red" style="marginRight: 5px">禁用</span>`
              }
            }
          },
          // {
          //   title: '描述',
          //   key: 'desc'
          // },
          // {
          //   title: '操作',
          //   key: 'action',
          //   render (row, column, index) {
          //     let id = row.id
          //     let childrenLength = row.children.length
          //     let button = ''
          //     /* 菜单为三级tree */
          //     // if (row.children.length === 0) {
          //     //   button += `<i-button type="text" size="small" @click="updateById(${id})">编辑</i-button>`
          //     //   button += `<i-button type="text" size="small" @click="updateIsDelById(${id}, ${childrenLength})">删除</i-button>`
          //     //   return button
          //     // } else {
          //       button = `<i-button type= "text" size= "small" @click.stop.prevent="addChild(${id}, 'URL')">增加子菜单</i-button>`
          //       // button += append
          //       button += `<i-button type= "text" size= "small" @click.stop.prevent="updateById(${id})">编辑</i-button>
          //                  <i-button type= "text" size= "small" @click.stop.prevent="updateIsDelById(${id}, ${childrenLength})">删除</i-button>`
          //       return button
          //     // }
          //   }
          // }
        ],
        contextURL: this,
        data: [],
        /* 按钮分页配置 */
        totalBtn: 0,
        pageBtn: 1,
        sizeBtn: 10,
        ids: [],
        roleId: '',
        parentIdMenu: '',
        parentIdURL: '',
        indexArrMenu: [],
        indexArrURL: [],
        dataMenuPointer: [],
        dataURLPointer: [],
        bindAuthIds: []
      }
    },
    mounted () {
      this.refresh(this.authType.BUTTON)
    },
    methods: {
      addTopAuth () {
        this.isTypeDisabled = false
        this.showformModal()
      },
      /* 添加子级表 */
      addChild (parentId, type) {
        this.isTypeDisabled = true
        this.parentId = parentId
        this.type = type
        /* 菜单项目 */
        this.formValidate.type = type
        this.showformModal()
      },
      /* table多选框选择 */
      select (data) {
        this.ids = common.getColumnData(data, 'id')
      },
      /* 切换tab触发不同请求 */
      switchTab (type) {
        this.cancelTable(type)
        switch (type) {
          case this.authType.BUTTON:
            this.getAuthBtn(true)
            break
          case this.authType.MENU:
            this.getAuthMenu(true)
            break
          case this.authType.URL:
            this.getAuthURL(true)
            break
          default:
            this.getAuthBtn(true)
            this.getAuthMenu(true)
            this.getAuthURL(true)
        }
      },
      /* 绑定权限 */
      // postBindAuth (type) {
      //   this.bindAuthIds = []
      //   let treeData
      //   switch (type) {
      //     case this.authType.MENU:
      //       treeData = this.dataMenu
      //       break
      //     case this.authType.URL:
      //       treeData = this.dataURL
      //       break
      //   }
      //   this.analyseIdFromTreeData(treeData)
      //   console.log(this.bindAuthIds, 'postData')
      //   this.$http.post(`/user/role/rolePermission?roleId=${this.roleId}`, this.bindAuthIds).then(({data}) => {
      //     this.SubmitLoading = false
      //     if (data.code == $HTTP.SUCCESS) {
      //       // this.getAuthMenu(this.roleId, true)
      //       this.$Notice.success({
      //         title: '成功提示',
      //         desc: `绑定角色权限成功`
      //       })
      //     }
      //   }, response => {
      //     this.SubmitLoading = false
      //   })
      // },
      /* 从treeData中解析ID */
      analyseIdFromTreeData (data) {
        for (let item of data) {
          if (item.id && item.checked) {
            this.bindAuthIds.push(item.id)
          }
          if (item.children) {
            this.analyseIdFromTreeData(item.children)
          }
        }
      },
      /* 根据ID数组显示复选框 */
      checkByBindAuthIds (ids, data) {
        for (let item of data) {
          /* 对应权限ID而非资源ID */
          if (ids.indexOf(item.id) >= 0) {
            item.checked = true
          }
          if (item.children.length > 0) {
            console.log(item.children)
            this.checkByBindAuthIds(ids, item.children)
          }
        }
      },
      /* 获取按钮权限 */
      getAuthBtn (reset) {
        if (reset) {
          this.dataBtn = []
        }
        let _this = this
        this.authSpin = true
        let params = {
          url: 'user/resource/findBtnByPage',
          params: {
            page: _this.pageBtn
          }
        }
        this.$refs['TableBtn'].load(params, this.getAuthBtnCb.bind(this))
      },
      getAuthBtnCb () {
        /* 处理获取后的data */
        this.dataBtn.map((item) => {
          item.desc = item.permission.desc
        })
        this.authSpin = false
      },
      /* 获取菜单权限 */
      getAuthMenu (reset) {
        let _this = this
        this.authSpin = true
        let type = 'MENU'
        /* 清空menu相关数据 */
        if (reset) {
          this.dataMenu = []
          this.parentIdMenu = ''
          this.indexArrMenu = []
          this.dataMenuPointer = []
        }
        this.$http.get(`user/resource/findAllResourceByType?type=${type}&parentId=${this.parentIdMenu}`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            let cdata = data.data
            console.log(data, 'menu')
            /* 若返回有值 */
            if (cdata.length > 0) {
              /* data转树形数据结构 */
              this.dataMenu = cdata
              this.mergeNameWithDesc(this.dataMenu)
              // this.data2Tree(cdata, this.dataMenu, type)
              _this.authSpin = false
            } else {
              console.log('无子级树！')
              _this.authSpin = false
            }
          }
        })
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
      /* 获取URL权限 */
      getAuthURL (reset) {
        let _this = this
        this.authSpin = true
        let type = 'URL'
        /* 清空url相关数据 */
        if (reset) {
          this.dataURL = []
          this.parentIdURL = ''
          this.indexArrURL = []
          this.dataURLPointer = []
        }
        this.$http.get(`user/resource/findAllResourceByType?type=${type}&parentId=${this.parentIdURL}`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            let cdata = data.data
            /* 若返回有值 */
            if (cdata.length > 0) {
              /* data转树形数据结构 */
              this.dataURL = cdata
              this.mergeNameWithDesc(this.dataURL)
              // this.data2Tree(cdata, this.dataURL, type)
              _this.authSpin = false
            } else {
              console.log('无子级树！')
              _this.authSpin = false
            }
          }
        })
      },
      /**
       * 获取子节点数据(menu)
       * @param arr 节点对应列表
       */
      getChildMenu (arr) {
        console.log(this.dataMenu, arr[0])
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
      updateIndexArr (arr, id, indexArr/* , pointer */) {
        /* pointer = pointer || 0 */
        // debugger
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
              if (this.updateIndexArr(item.children, id, indexArr/* , pointer */)) {
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
       * 返回所有权限树形结构
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
          var _item = JSON.parse(JSON.stringify(item))
          _item.children = []
          list.push(_item)
        }
        _this.pushTreeData(treeData, list, indexArr, type)
        treeData.map((item) => {
          item.desc = item.permission.desc
        })
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
          // parentNode.expand = true
        } else {
          data.push(...list)
        }
      },
      ruleOrganization (val) {
        /* 规定组织是否必填 */
        this.ruleValidate.organizationType[0].required = !val
      },
      cancelTable (type) {
        if (type) {
          switch (type) {
            case this.authType.BUTTON:
              this.dataBtn = []
              break
            case this.authType.MENU:
              this.dataMenu = []
              break
            case this.authType.URL:
              this.dataURL = []
              break
          }
        } else {
          this.dataBtn = []
          this.dataMenu = []
          this.dataURL = []
        }
      },
      /**
       * 加载第一页表格
       * @param type 表格类型，默认全部重新加载
       */
      refresh(type) {
        switch (type) {
          case this.authType.BUTTON:
            this.getAuthBtn(true)
            break
          case this.authType.MENU:
            this.getAuthMenu(true)
            break
          case this.authType.URL:
            this.getAuthURL(true)
            break
          default:
            this.getAuthBtn(true)
            this.getAuthMenu(true)
            this.getAuthURL(true)
            break
        }
      },
      /* 加载第n页请求 */
      load(page, size) {
        this.ids = []
        this.data = []
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
      pageChangeBtn(page) {
        this.pageBtn = page;
        this.getAuthBtn()
      },
      /* 改变页面容量，重新加载 */
      pageSizeChangeBtn(size) {
        this.sizeBtn = size
        this.getAuthBtn()
      },
      /* 得到每页数据 */
      selectBtn(data) {
        this.ids = common.getColumnData(data, 'id')
      },
      /* 加载前先重置表单数据 */
      cancel() {
        this.handleReset('formValidate')
        setTimeout(() => {
          this.formValidate = this.initialFormValidate
          this.SubmitLoading = false
          this.isUpdate = false
        }, 500)
      },
      /* vue方法清除表单数据 */
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      /* 显示增加角色弹窗 */
      showformModal () {
        this.modalName = '增加权限'
        this.formModal = true
      },
      /* 添加权限请求（提交数据） */
      addAuth(name, type) {
        common.clearString(this.formValidate, ['name', 'link'])
        this.SubmitLoading = true;
        // console.log(this.$refs, 'refs')
        this.$refs[name].validate((valid) => {
          if (valid) {
            let formData = JSON.parse(JSON.stringify(this.formValidate))
            if (this.parentId) {
              formData.parentId = this.parentId
            }
            this.$http.post('/user/resource/saveResourcePermission', formData).then(({data}) => {
              this.SubmitLoading = false
              if (data.code == $HTTP.SUCCESS) {
                this.formModal = false
                this.cancel()
                console.log(type, 'type')
                this.switchTab(type)
                this.$Notice.success({
                  title: '成功提示',
                  desc: `添加权限成功`
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
      /* 编辑权限请求（提交数据） */
      updateAuth(name, type) {
        common.clearString(this.formValidate, ['name', 'link'])
        // this.cancelTable()
        this.SubmitLoading = true;
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post('/user/resource/updateResourcePermission', this.formValidate).then(({data}) => {
              this.SubmitLoading = false
              if (data.code == $HTTP.SUCCESS) {
                this.formModal = false
                this.cancel()
                /* 重新加载table/treeTable */
                this.switchTab(type)
                this.$Notice.success({
                  title: '成功提示',
                  desc: `修改权限成功`
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
      /* 单独编辑权限请求（弹出modal） */
      updateById(id) {
        this.roleId = id
        this.modalName = '修改权限'
        this.isUpdate = true
        this.isTypeDisabled = true
        this.$http.get(`/user/resource/updateBackResourcePermission?resourceId=${id}`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.formModal = true
            /* 将data.permission.desc映射到data.desc */
            data.data.desc = data.data.permission.desc
            this.formValidate = data.data
          }
        })
      },
      /* 删除权限请求 */
      updateIsDel(ids, type) {
        // let idsJson = JSON.stringify({ ids })
        this.$http.post(`/user/resource/delResourcePermission`, ids, {
          headers: {
            'content-type': 'application/json;charset=UTF-8'
          }
        }).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.$Modal.remove()
            this.switchTab(type)
            this.$Notice.success({
              title: '成功提示',
              desc: `删除权限成功`
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
        // 渲染第一栏
        this.getAuthBtn()
      },
      /* 单独启用禁用 */
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
      /* 单独删除 */
      updateIsDelById(id) {
        let ids = [id]
        this.$Modal.confirm({
          title: '确认提示',
          content: '确认要删除权限吗？',
          loading: true,
          onOk: () => {
            this.updateIsDel(ids)
            // todo 删除
          }
        })
      },
      /* 批量启用禁用 */
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
      /* 批量删除 */
      updateIsDelBatch() {
        if (this.ids.length == 0) {
          this.$Notice.error({
            title: '警告提示',
            desc: `请至少选择一条数据`
          })
        } else {
          this.$Modal.confirm({
            title: '确认提示',
            content: '确认要删除权限吗？',
            loading: true,
            onOk: () => {
              this.updateIsDel(this.ids)
            }
          })
        }
      }
    }
  }
</script>
