<template>
  <Button-group class="tablePanel">
    <!-- 编辑/添加弹窗 -->
    <Modal v-model="formModal.show"
          :title="formModal.title"
          @on-cancel="cancel"
          width="1000px"
          :mask-closable="false">
      <Row :gutter="16">
        <Col span="12">
          <Form ref="formValidate"
                :model="formValidate"
                :rules="ruleValidate"
                :label-width="80">
            <Form-item label="该组织名"
                      prop="name">
              <Input v-model="formValidate.name"
                    placeholder="请输入该组织名"
                    :maxlength="20"
                    v-number-letter-chinese-symbol-only></Input>
            </Form-item>
            <Form-item label="该组织编号"
                      prop="code">
              <Input v-model="formValidate.code"
                    placeholder="请输入该组织编号"
                    :maxlength="10"
                    v-number-letter-only></Input>
            </Form-item>
            <Form-item label="电话"
                      prop="telephone">
              <Input v-model="formValidate.telephone"
                    placeholder="请输入电话号码"
                    :maxlength="12"></Input>
            </Form-item>
            <Row :gutter="16">
              <Col span="12">
                <Form-item label="省"
                          prop="province">
                  <Input v-model="formValidate.province"
                        ></Input>
                </Form-item>
              </Col>
              <Col span="12">
                <Form-item label="市"
                          prop="city">
                  <Input v-model="formValidate.city"
                        ></Input>
                </Form-item>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col span="12">
                <Form-item label="区"
                          prop="district">
                  <Input v-model="formValidate.district"
                        ></Input>
                </Form-item>
              </Col>
              <Col span="12">
                <Form-item label="街道"
                          prop="street">
                  <Input v-model="formValidate.street"
                        ></Input>
                </Form-item>
              </Col>
            </Row>
            <Form-item label="详细地址"
                      prop="detailedAddress">
              <Input v-model="formValidate.detailedAddress"
                    :maxlength="50"
                    v-number-letter-chinese-symbol-only></Input>
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
          </Form>
        </Col>
        <Col span="12">
          <div id="baidu-map-AC" style="height: 420px"></div>
        </Col>
      </Row>
      <div slot="footer">
        <Button v-if="isUpdate"
                :loading="SubmitLoading"
                @click="updateOrganization('formValidate')">提交
        </Button>
        <Button v-else
                :loading="SubmitLoading"
                @click="addOrganization('formValidate')">提交
        </Button>
      </div>
    </Modal>
    <Role v-model="role.show" :id="role.id"></Role>
    <ServiceProvider v-model="serviceProvider.show"></ServiceProvider>
    <!-- 按钮组 -->
    <div class="mb-10 d-ib">
      <Button icon="android-add"
              @click="showformModal" class="ivu-btn-default">增加顶级组织
      </Button>
      <Button icon="android-calendar"
              @click="showServiceProvider" class="ivu-btn-default">待处理服务商
      </Button>
      <Button icon="android-remove"
              @click="updateIsDelBatch" class="ivu-btn-default">删除
      </Button>
      <Button icon="android-refresh"
              @click="switchTab" class="ivu-btn-default">刷新
      </Button>
    </div>
    <!-- 查询 -->
    <div @keydown.enter="keyGetAC" class="f-r">
      <Button-group>
        <Input v-model="searchInput" placeholder="请输入"
              :maxlength="20" class="ivu-input-default"
              v-number-letter-chinese-only></Input>
      </Button-group>
      <Button-group style="margin-left: 10px;">
        <Button icon="android-search" @click="getAC()" class="ivu-btn-default">
          查询
        </Button>
      </Button-group>
    </div>
    <!-- 标签栏 -->
    <!-- <Tabs @on-click="switchTab"
          :style="{'min-height': '500px'}"> -->
      <!-- 区域中心 -->
      <!-- <Tab-pane label="区域中心" icon=""> -->
        <div class="spin-outer">
          <!-- table -->
          <div class="spin-outer">
            <!-- 树形表格 -->
            <TreeTable
                       :data="AC.data"
                       :columns="AC.columns"
                       :context="AC.context"
                       @tree-level-select="loadChildAC"
                       ></TreeTable>
            <!-- 分页 -->
            <!-- <Page :total="AC.total"
                  :page-size="AC.size"
                  show-elevator
                  show-sizer
                  show-total
                  @on-change="pageChangeAC"
                  @on-page-size-change="pageSizeChangeAC"></Page> -->
            <!-- 加载中 -->
            <Spin size="large"
                  fix
                  v-if="spin"
                  class="login_loading_spin">
              <Icon type="load-c"
                    size="18"
                    class="login-spin-icon-load"></Icon>
              <div>加载中...</div>
            </Spin>
          </div>
        </div>
      <!-- </Tab-pane> -->
    <!-- </Tabs> -->
  </Button-group>
</template>

<script>
  import Role from './Role.vue'
  import ServiceProvider from './ServiceProvider.vue'
  export default {
    name: 'AreaCenter',
    components: {
      Role,
      ServiceProvider
    },
    data () {
      return {
        DList,
        searchInput: '',
        role: {
          show: false,
          id:''
        },
        serviceProvider: {
          show: false
        },
        SubmitLoading: false,
        formModal: {
          show: false,
          title: ''
        },
        isUpdate: false,
        spin: false,
        /* 初始化表单格式 */
        initialFormValidate: {
          name: '',
          code: '',
          telephone: '',
          province: '',
          city: '',
          district: '',
          street: '',
          detailedAddress: '',
          longitude: '',
          latitude: '',
          isActive: 1,
          type: 'AREACENTER',
          id: '',
          parent: {
            id: ''
          }
        },
        /* 表单格式 */
        formValidate: {
          name: '',
          code: '',
          telephone: '',
          province: '',
          city: '',
          district: '',
          street: '',
          detailedAddress: '',
          longitude: '',
          latitude: '',
          isActive: 1,
          type: 'AREACENTER',
          id: '',
          parent: {
            id: ''
          }
        },
        /* 必填规则 */
        ruleValidate: {
          name: [
            {required: true, message: '组织名不能为空', trigger: 'blur'},
            {type: 'string', min: 1, max: 20, message: '组织名不能大于20位', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '组织编号不能为空', trigger: 'blur'},
            {type: 'string', min: 1, max: 10, message: '组织编号不能大于10位', trigger: 'blur'}
          ],
          telephone: [
            {required: true, message: '电话号不能为空', trigger: 'blur'},
            {type: 'string', min: 1, max: 12, pattern: /^(1[34578][0-9]{9})|(0\d{10,11})$/, message: '请输入正确的手机号或座机号，座机号必须输入区号', trigger: 'blur'}
          ],
          province: [
            {required: true, message: '请选择地址', trigger: 'blur'},
            {type: 'string', min: 1, max: 20, message: '请选择组织地址', trigger: 'blur'}
          ],
          city: [
            {required: true, message: '请选择地址', trigger: 'blur'},
            {type: 'string', min: 1, max: 20, message: '请选择组织地址', trigger: 'blur'}
          ],
          district: [
            {required: true, message: '请选择地址', trigger: 'blur'},
            {type: 'string', min: 1, max: 20, message: '请选择组织地址', trigger: 'blur'}
          ],
          detailedAddress: [
            {required: true, message: '请选择地址', trigger: 'blur'},
            {type: 'string', min: 1, max: 50, message: '请选择组织地址', trigger: 'blur'}
          ],
          isActive: [
            {type: 'number', required: true, message: '必须选择是否启用', trigger: 'change'}
          ],
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
        types: {
          AC: 'AREACENTER'
        },
        /* 区域中心分页配置 */
        AC: {
          data: [],
          context: this,
          columns: [
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
              title: '组织编号',
              key: 'code'
            },
            {
              title: '地址',
              key: 'addr'
            },
            {
              title: '联系电话',
              key: 'telephone'
            },
            {
              title: '操作',
              key: 'action',
              render (row, column, index) {
                let id = row.id
                let childrenLength = row.children.length
                let button = ''
                /* 服务商无子菜单 */
                if (index === 3) {
                  button = `<i-button type= "text" size= "small" @click.stop.prevent="showRole(${id})">用户</i-button>`
                  // button += append
                  button += `<i-button type= "text" size= "small" @click.stop.prevent="updateById(${id})">编辑</i-button>
                            <i-button type= "text" size= "small" @click.stop.prevent="updateIsDelById(${id})">删除</i-button>`
                  return button
                } else {
                  button = `<i-button type= "text" size= "small" @click.stop.prevent="addChildOrganization(${id})">添加子组织</i-button>`
                  // button += append
                  button += `<i-button type= "text" size= "small" @click.stop.prevent="showRole(${id})">用户</i-button>
                            <i-button type= "text" size= "small" @click.stop.prevent="updateById(${id})">编辑</i-button>
                            <i-button type= "text" size= "small" @click.stop.prevent="updateIsDelById(${id})">删除</i-button>`
                  return button
                }
              }
            }
          ],
          total: 0,
          page: 1,
          size: 10,
          parentId: '',
          indexArr: []
        },
        baiduMap: null,
        isTop: false
      }
    },
    created () {
      this.getAC()
    },
    mounted () {
    },
    methods: {
      keyGetAC () {
        this.getAC()
      },
      addChildOrganization (id) {
        this.AC.parentId = id
        this.AC.indexArr = []
        this.updateIndexArr(this.AC.data, this.AC.parentId, this.AC.indexArr)
        switch (this.AC.indexArr.length) {
          case 1:
            this.formValidate.type = DList.Organization.AREACENTER
            break
          case 2:
            this.formValidate.type = DList.Organization.SERVICE
            break
        }
        /* 清空添加/编辑组织表单 */
        this.handleReset('formValidate')
        this.formModal.title = '增加子组织'
        switch (this.formValidate.type) {
          case DList.Organization.AREACENTER:
            this.formModal.title += '-片区'
            break
          case DList.Organization.SERVICE:
            this.formModal.title += '-服务商'
            break
        }
        this.formModal.show = true
        if(!this.baiduMap){
          this.loadMap();
        }else{
          this.getLocation("北京市");
        }
      },
      fillAddress (table) {
        table.map((item) => {
          item.addr = item.province + item.city + item.district + item.street + item.detailedAddress || ''
        })
      },
      loadMap(){
        // 百度地图API功能
        this.baiduMap = new BMap.Map("baidu-map-AC");  // 创建Map实例
        this.baiduMap.centerAndZoom("北京", 8);
        this.baiduMap.addEventListener("click", this.showInfo);
      },
      getLocation(name){
        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();
        var baiduMap = this.baiduMap;
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint(name, function(point){
          if (point) {
            // 清除之前标注点
            baiduMap.clearOverlays()
            let marker = new BMap.Marker(point) // 创建标注
            baiduMap.addOverlay(marker)              // 将标注添加到地图中
            marker.setAnimation(BMAP_ANIMATION_BOUNCE)
            // 标注点始终在正中间
            baiduMap.setCenter(point)
          }
        }, name);
      },
      showInfo(e){
        this.baiduMap.clearOverlays();

        // 解析点坐标
        var point = new BMap.Point(e.point.lng, e.point.lat)
        var marker = new BMap.Marker(point)  // 创建标注

        this.baiduMap.addOverlay(marker)               // 将标注添加到地图中
        marker.setAnimation(BMAP_ANIMATION_BOUNCE) //跳动的动画
        // 点击之后的地址放进输入框
        var geoc = new BMap.Geocoder()
        var pt = e.point
        var vue = this
        // var name = vue.formValidate.name;
        // var type = vue.formValidate.type;
        // var code = vue.formValidate.code;
        // var telephone = vue.formValidate.telephone;
        // var detailedAddress = vue.formValidate.detailedAddress;
        geoc.getLocation(pt, function(rs) {
          var addComp = rs.addressComponents;
          Object.assign(vue.formValidate, addComp)
          vue.formValidate.longitude = e.point.lat
          vue.formValidate.latitude = e.point.lng
          // vue.formValidate = {
          //   name: name,
          //   code: code,
          //   telephone: telephone,
          //   province: addComp.province,
          //   city: addComp.city,
          //   type: type,
          //   district: addComp.district,
          //   street: addComp.street,
          //   detailedAddress: detailedAddress,
          //   longitude: e.point.lat,
          //   latitude: e.point.lng,
          //   isActive: 1,
          //   parentId: null
          // };
        })
      },
      addOrganization(name) {
        common.clearString(this.formValidate, ['name'])
        this.SubmitLoading = true;
        this.$refs[name].validate((valid) => {
          if (valid) {
            /* 添加组织不允许传id */
            this.formValidate.id = ''
            let data
            if (this.isTop) {
              data = JSON.parse(JSON.stringify(this.formValidate))
              /* 顶级组织删除parent字段 */
              delete(data.parent)
            } else {
              data = JSON.parse(JSON.stringify(this.formValidate))
            }
            this.$http.post(`/user/organization/saveOrganization`, data).then(({data}) => {
              this.SubmitLoading = false
              if (data.code == $HTTP.SUCCESS) {
                this.formModal.show = false
                this.cancelTable()
                this.getAC()
                this.isTop = false
                this.$Notice.success({
                  title: '成功提示',
                  desc: `添加组织成功`
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
      updateOrganization(name) {
        common.clearString(this.formValidate, ['name'])
        this.SubmitLoading = true;
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post('/user/organization/updateOrganization', this.formValidate).then(({data}) => {
              this.SubmitLoading = false
              if (data.code == $HTTP.SUCCESS) {
                this.formModal.show = false
                this.cancelTable()
                this.getAC()
                this.$Notice.success({
                  title: '成功提示',
                  desc: `修改区域中心成功`
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
      showRole (id) {
        this.role.show = true
        this.role.id = id
      },
      showServiceProvider () {
        this.serviceProvider.show = true
      },
      /* 添加子级表 */
      addChild (parentId, type) {
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
      switchTab (index) {
        this.searchInput = ''
        this.cancelTable()
        switch (index) {
          case this.types.AC:
          case 0:
            this.getAC(true)
            break
          default:
            this.getAC(true)
            break
        }
      },
      clearChildren (data) {
        data.map((item) => {
          item.children = []
        })
      },
      /* 获取AC列表 */
      getAC (reset) {
        let _this = this
        this.spin = true
        let type = this.types.AC
        let url = `/user/organization/findAllOrganizationByTypeAndNameLike`
        let query = `?type=${type}`
        /* 清空AC相关数据 */
        if (reset) {
          this.AC.data = []
          this.AC.parentId = ''
          this.AC.indexArr = []
        }
        // 带查询关键词
        if (this.searchInput) {
          query += `&name=${this.searchInput}`
        }
        let newPage = common.analysisPage(this.AC.page)
        this.$http.get(url + query).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            let tableData = data.data
            // this.clearChildren(tableData)
            this.fillAddress(tableData)
            this.AC.data = tableData
            this.AC.total = data.data.totalElements
            this.spin = false
          }
        })
      },
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
            this.checkByBindAuthIds(ids, item.children)
          }
        }
      },
      /**
       * 获取子节点数据(menu)
       * @param arr 节点对应列表
       */
      loadChildAC (arr) {
        if (!arr[0].children.length) {
          /* 选中节点id */
          this.AC.parentId = arr[0].id
          /* 清空指针数组 */
          this.AC.indexArr = []
          this.updateIndexArr(this.AC.data, this.AC.parentId, this.AC.indexArr)
          // let index = this.dataURLPointer.indexOf(arr[0])
          // /* 层级数组添加index */
          // this.indexArrURL.push(index)
          this.getChildAC()
        } else {
          console.log('已经请求过该节点下的data了！')
        }
      },
      getChildAC () {
        let _this = this
        this.spin = true
        let type = this.types.AC
        this.$http.get(`/user/organization/findAllByParentId?parentId=${this.AC.parentId}`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            let cdata = data.data
            this.clearChildren(cdata)
            /* 若返回有值 */
            if (cdata.length > 0) {
              /* data转树形数据结构 */
              this.data2Tree(cdata, this.AC.data, type)
              _this.spin = false
            } else {
              console.log('无子级树！')
              _this.spin = false
            }
          }
        })
      },
      /**
       * 更新当前级别指针数组
       * @param arr 节点对应列表
       * @param id 根据id判断指针数组指向位置
       * @param type 指针数组类型
       */
      updateIndexArr (arr, id, indexArr) {
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
      updateById (id) {
        this.isUpdate = true
        this.$http.get(`/user/organization/findOrganizationById?id=${id}`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            /* 清空添加/编辑组织表单 */
            this.handleReset('formValidate')
            this.formModal.title = '编辑区域中心'
            this.formModal.show = true
            /* 合并需要的字段 */
            Object.keys(this.formValidate).forEach((key) => {
              if (key in data.data) {
                this.formValidate[key] = data.data[key]
              }
            })
            if(!this.baiduMap){
                this.loadMap();
            }
            var addressName = this.formValidate.province + this.formValidate.city + this.formValidate.distrcit;
            if(!addressName){
              addressName = "北京市";
            }
            var vue = this;
            setTimeout(function(){
              vue.getLocation(addressName);
            }, 500)
          }
        })
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
          case this.types.AC:
            indexArr = this.AC.indexArr
            break
        }
        for (let i in data) {
          var item = data[i]
          var _item = JSON.parse(JSON.stringify(item))
          _item.children = []
          list.push(_item)
        }
        _this.pushTreeData(treeData, list, indexArr, type)
      },
      /**
       * 填充树形结构
       * @param data 数据列表
       * @param _item 填充内容
       * @param indexArr 填充层级
       */
      pushTreeData (data, list, indexArr, type) {
        let parentNodeChildren = []
        let parentNode = []
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
      /* 取消table */
      cancelTable (type) {
        if (type) {
          switch (type) {
            case this.types.AC:
              this.AC.data = []
              break
          }
        } else {
          this.AC.data = []
        }
      },
      /* 调用加载第n页方法 */
      pageChangeAC(page) {
        this.AC.page = page;
        this.getAC()
      },
      /* 改变页面容量，重新加载 */
      pageSizeChangeAC(size) {
        this.AC.size = size
        this.getAC()
      },
      /* 得到每页数据 */
      selectAC(data) {
        this.AC.ids = common.getColumnData(data, 'id')
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
      showformModal() {
        /* 清空添加/编辑组织表单 */
        this.handleReset('formValidate')
        this.formModal.title = '增加顶级组织'
        this.isTop = true
        this.formModal.show = true
        if(!this.baiduMap){
          this.loadMap();
        }else{
          this.getLocation("北京市");
        }
      },
      deleteById(id, cl) {
        if (cl > 0) {
          this.$Notice.error({
            title: '警告提示',
            desc: `请先删除子该组织`
          })
        } else {
          this.$Modal.confirm({
            title: '确认提示',
            content: '确认删除此该组织吗？',
            loading: true,
            onOk: () => {
              this.$http.delete(`/user/organization?id=${id}`).then(({data}) => {
                if (data.code == $HTTP.SUCCESS) {
                  this.$Modal.remove()
                  this.getAC()
                  this.$Notice.success({
                    title: '成功提示',
                    desc: `删除该组织成功`
                  })
                }
              })
            }
          })
        }
      },
      /* 删除请求 */
      updateIsDel(ids) {
        this.$http.post(`/user/organization/updateIsDelByIds?isDel=` + DList.Attribute.YES, ids).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.$Modal.remove()
            this.getAC()
            this.$Notice.success({
              title: '成功提示',
              desc: `删除组织成功`
            })
          }
        })
      },
      /* 根据单个id删除 */
      updateIsDelById(id) {
        let ids = [id]
        this.$Modal.confirm({
          title: '确认提示',
          content: '确认要删除该组织吗？',
          loading: true,
          onOk: () => {
            this.updateIsDel(ids)
          }
        })
      },
      /* 根据多个id删除 */
      updateIsDelBatch() {
        if (this.ids.length == 0) {
          this.$Notice.error({
            title: '警告提示',
            desc: `请至少选择一条数据`
          })
        } else {
          this.$Modal.confirm({
            title: '确认提示',
            content: '确认要删除该组织吗？',
            loading: true,
            onOk: () => {
              this.updateIsDel(this.ids)
            }
          })
        }
      }
    },
    watch: {
      'AC.parentId' (val) {
        this.formValidate.parent.id = val
      }
    }
  }
</script>
