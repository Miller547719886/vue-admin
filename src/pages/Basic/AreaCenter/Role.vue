<template>
  <div class="area-center-role">
    <Modal v-model="bindUserModal"
           title="组织已绑定用户"
           width="900">
      <div class="mb-10 d-ib">
        <Button icon="android-add"
                @click="showUserModal" class="ivu-btn-default">新增
        </Button>
        <Button icon="android-add"
                @click="showUnBindUserModal" class="ivu-btn-default">添加
        </Button>
        <Button icon="android-remove"
                @click="unBindUserAndOrganizationBatch" class="ivu-btn-default">解绑
        </Button>
        <Button icon="android-refresh"
                @click="refreshBindUser" class="ivu-btn-default">刷新
        </Button>
      </div>
      <Button-group style="float: right;margin-left: 10px;">
        <Button icon="android-select"
                @click="loadUserInOrganization(bindUserModalData.organizationId, 1)" class="ivu-btn-default">查询
        </Button>
      </Button-group>
      <Button-group style="float: right">
        <Input v-model="bindUserModalData.account" placeholder="请输入用户名"
               :maxlength="20" class="ivu-input-default" v-number-letter-chinese-only></Input>
      </Button-group>
      <PageTable ref="TableBindUser" :showSizer="false"
             :columns="bindUserModalData.columns"
             @on-selection-change="bindUserSelect">
      </PageTable>
    </Modal>
    <Modal v-model="unBindUserModal"
           title="组织未绑定用户"
           width="900">
      <Button-group>
        <Button icon="android-add"
                @click="bindUserAndOrganizationBatch">绑定
        </Button>
        <Button icon="android-refresh"
                @click="refreshUnBindUser">刷新
        </Button>
      </Button-group>
      <Button-group style="float: right;margin-left: 10px;">
        <Button icon="android-select"
                @click="loadUserNotInOrganization(bindUserModalData.organizationId, 1)">查询
        </Button>
      </Button-group>
      <Button-group style="float: right">
        <Input v-model="unBindUserModalData.account" placeholder="请输入用户名"
               :maxlength="20" v-number-letter-chinese-only></Input>
      </Button-group>
      <PageTable ref="TableUnBindUser" :showSizer="false" style="margin-top: 10px"
             :columns="unBindUserModalData.columns"
             @on-selection-change="unBindUserSelect">
      </PageTable>
    </Modal>
    <Modal v-model="bindRoleModal"
           title="组织用户已绑定角色"
           width="900">
      <Button-group>
        <Button icon="android-add"
                @click="showUnBindRoleModal">添加
        </Button>
        <Button icon="android-remove"
                @click="unBindRoleByUserOrganizationBatch">解绑
        </Button>
        <Button icon="android-refresh"
                @click="refreshBindRole">刷新
        </Button>
      </Button-group>
      <PageTable ref="TableBindRole" :showSizer="false" style="margin-top: 10px"
             :columns="bindRoleModalData.columns"
             @on-selection-change="bindRoleSelect">
      </PageTable>
    </Modal>
    <Modal v-model="unBindRoleModal"
           title="组织用户未绑定角色"
           width="900">
      <Button-group>
        <Button icon="android-add"
                @click="bindRoleByUserOrganizationBatch">绑定
        </Button>
        <Button icon="android-refresh"
                @click="refreshUnBindRole">刷新
        </Button>
      </Button-group>
      <PageTable ref="TableUnBindRole" :showSizer="false" style="margin-top: 10px"
             :columns="unBindRoleModalData.columns"
             @on-selection-change="unBindRoleSelect">
      </PageTable>
    </Modal>
    <Modal v-model="userModal"
           :title="userModalData.modalName"
           @on-cancel="cancel"
           :mask-closable="false">
      <Form ref="userModalData.formValidate"
            :model="userModalData.formValidate"
            :rules="userModalData.ruleValidate"
            :label-width="80">
        <Form-item label="用户昵称"
                   prop="name">
          <Input v-model="userModalData.formValidate.name"
                 placeholder="请输入用户昵称"
                 :maxlength="10" v-number-letter-chinese-only></Input>
        </Form-item>
        <Form-item label="密码"
                   prop="password">
          <Input type="password" v-model="userModalData.formValidate.password"
                 placeholder="不填则表示不修改密码"
                 :maxlength="20"
                 v-number-letter-symbol-only></Input>
        </Form-item>
        <Form-item label="手机号"
                   prop="mobile">
          <Input v-model="userModalData.formValidate.mobile"
                 placeholder="请输入用户手机号"
                 :maxlength="11"></Input>
        </Form-item>
        <!-- <Form-item label="用户工号"
                   prop="accountCode">
          <Input v-model="userModalData.formValidate.accountCode"
                 placeholder="请输入用户工号"
                 :maxlength="20"></Input>
        </Form-item> -->
        <Form-item label="是否启用"
                   prop="isActive">
          <Select v-model="userModalData.formValidate.isActive">
            <Option :value="DList.Attribute.YES">
              启用
            </Option>
            <Option :value="DList.Attribute.NO">
              禁用
            </Option>
          </Select>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button v-if="userModalData.isUpdate"
                :loading="SubmitLoading"
                @click="updateAccount('userModalData.formValidate')">提交
        </Button>
        <Button v-else
                :loading="SubmitLoading"
                @click="addAccount('userModalData.formValidate')">提交
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import PageTable from '@/components/Table/PageTable'
  export default {
    name: 'AreaCenterRole',
    components: {
      PageTable
    },
    data () {
      return {
        DList,
        SubmitLoading: false,
        bindUserModal: false,
        unBindUserModal: false,
        bindRoleModal: false,
        unBindRoleModal: false,
        userModal: false,
        bindUserModalData: {
          total: 0,
          page: 1,
          size: 10,
          data: [],
          ids: [],
          organizationId: null,
          account: null,
          columns: [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '用户名',
              key: 'account'
            },
            {
              title: '用户昵称',
              key: 'name'
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
                        this.showBindRoleByUserOrganization(id)
                      }
                    }
                  }, '角色'),
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
                        this.updateUserById(id)
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
                        this.unBindUserAndOrganizationById(id)
                      }
                    }
                  }, '解绑')
                ]);
              }
            }
          ]
        },
        unBindUserModalData: {
          total: 0,
          page: 1,
          size: 10,
          data: [],
          ids: [],
          account: null,
          columns: [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '用户名',
              key: 'account'
            },
            {
              title: '用户昵称',
              key: 'name'
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
                        this.bindUserAndOrganizationById(id)
                      }
                    }
                  }, '绑定')
                ]);
              }
            }
          ]
        },
        bindRoleModalData: {
          total: 0,
          page: 1,
          size: 10,
          data: [],
          ids: [],
          userId: null,
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
                        this.unBindRoleByUserOrganizationById(id)
                      }
                    }
                  }, '解绑')
                ]);
              }
            }
          ]
        },
        unBindRoleModalData: {
          total: 0,
          page: 1,
          size: 10,
          data: [],
          ids: [],
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
                        this.bindRoleByUserOrganizationById(id)
                      }
                    }
                  }, '绑定')
                ]);
              }
            }
          ]
        },
        userModalData: {
          modalName:null,
          isUpdate: false,
          formValidate: {
            id: '',
            account: '',
            name: '',
            // accountCode: '',
            mobile: '',
            password: '',
            isActive: DList.Attribute.YES
          },
          ruleValidate: {
            account: [
              {required: true, message: '用户账号不能为空', trigger: 'blur'},
              {type: 'string', min: 1, max: 10, message: '用户账号不能小于1位或大于10位', trigger: 'blur'}
            ],
            name: [
              {required: true, message: '用户昵称不能为空', trigger: 'blur'},
              {type: 'string', min: 1, max: 20, message: '昵称不能不能小于1位或大于20位', trigger: 'blur'}
            ],
            password: [
              {/* required: true, */ message: '密码不能为空', trigger: 'blur'},
              {type: 'string', min: 6, max: 20, message: '用户密码不能小于6位或大于20位', trigger: 'blur'}
            ],
            // accountCode: [
            //   {required: true, message: '用户工号不能为空', trigger: 'blur'},
            //   {type: 'string', min: 1, max: 20, message: '用户工号不能大于20位', trigger: 'blur'}
            // ],
            mobile: [
              {required: true, message: '手机号不能为空', trigger: 'blur'},
              {type: 'string', pattern: /^1[34578]\d{9}$/, message: '输入手机号不符合规范', trigger: 'blur'}
            ],
            isActive: [
              {type: 'number', required: true, message: '必须选择是否启用', trigger: 'change'}
            ]
          }
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        require: true
      },
      id: {
        type: [Number, String],
        require: true
      }
    },
    model: {
      prop: 'value',
      event: 'input'
    },
    created () {
      /* 刷新主表格 */
      // this.refresh()
    },
    methods: {
      updateUserById (id) {
        this.userModal = true
        this.userModalData.modalName = "编辑用户"
        this.userModalData.isUpdate = true
        this.$http.get(`/user/user/findUserByUserId?userId=${id}`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            // this.formModal = true
            this.userModalData.formValidate = {
              id: data.data.data.id,
              name: data.data.data.name,
              // accountCode: data.data.data.accountCode,
              mobile: data.data.data.mobile,
              // password: '********',
              isActive: data.data.data.isActive,
            }
          }
        })
      },
      /* 刷新绑定用户 */
      refreshBindUser(){
        this.bindUserModalData.account = null;
        this.loadUserInOrganization(this.bindUserModalData.organizationId, 1);
      },
      //获取组织下用户列表
      loadUserInOrganization(organizationId, page){
        //先至为空 否则会热替换
        this.bindUserModalData.ids = []
        let params = {
          url: '/user/organization/findUserByOrganization',
          params: {
            page,
            id: organizationId
          }
        }
        if (this.bindUserModalData.account) {
          params.params.account = this.bindUserModalData.account
        }
        this.$refs['TableBindUser'].load(params)
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      //新增组织下的用户
      addAccount(name) {
        common.clearString(this.userModalData.formValidate, ['name'/* , 'accountCode' */])
        this.SubmitLoading = true;
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.userModalData.formValidate.account = this.userModalData.formValidate.mobile;
            this.$http.post('/user/organization/addUserByOrganization?organizationId=' + this.bindUserModalData.organizationId, this.userModalData.formValidate).then(({data}) => {
              this.SubmitLoading = false
              if (data.code == $HTTP.SUCCESS) {
                this.userModal = false
                this.cancel()
                this.loadUserInOrganization(this.bindUserModalData.organizationId, 1)
                this.$Notice.success({
                  title: '成功提示',
                  desc: `添加用户成功`
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
      updateAccount(name) {
        common.clearString(this.userModalData.formValidate, ['name'/* , 'accountCode' */])
        this.SubmitLoading = true;
        this.$refs[name].validate((valid) => {
          if (valid) {
            if(this.userModalData.formValidate.password == "********"){
              this.userModalData.formValidate.password = null;
            }
            this.$http.post('/user/user/updateUser', this.userModalData.formValidate).then(({data}) => {
              this.SubmitLoading = false
              if (data.code == $HTTP.SUCCESS) {
                this.userModal = false
                // 清空数据
                this.cancel()
                // 刷新列表
                this.loadUserInOrganization(this.bindUserModalData.organizationId, 1)
                this.$Notice.success({
                  title: '成功提示',
                  desc: `修改用户成功`
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
      setPage(type, cdata){
        if ("bindUserModalData" == type) {
          this.bindUserModalData.total = cdata.totalElements;
          this.bindUserModalData.size = cdata.size;
          this.bindUserModalData.page = cdata.number + 1;
        } else if ("unBindUserModalData" == type) {
          this.unBindUserModalData.total = cdata.totalElements;
          this.unBindUserModalData.size = cdata.size;
          this.unBindUserModalData.page = cdata.number + 1;
        } else if ("bindRoleModalData" == type) {
          this.bindRoleModalData.total = cdata.totalElements;
          this.bindRoleModalData.size = cdata.size;
          this.bindRoleModalData.page = cdata.number + 1;
        } else if("unBindRoleModalData" == type){
          this.unBindRoleModalData.total = cdata.totalElements;
          this.unBindRoleModalData.size = cdata.size;
          this.unBindRoleModalData.page = cdata.number + 1;
        } else {
          this.total = cdata.totalElements;
          this.size = cdata.size;
          this.page = cdata.number + 1;
        }
      },
      //获取组织下用户列表
      loadUserNotInOrganization(organizationId, page){
        //先至为空 否则会热替换
        this.unBindUserModalData.ids = []
        let params = {
          url: '/user/organization/findOrganizationUnBindUser',
          params: {
            page,
            id: organizationId
          }
        }
        if (this.unBindUserModalData.account) {
          params.params.account = this.unBindUserModalData.account;
        }
        this.$refs['TableUnBindUser'].load(params)
      },
      refreshUnBindUser(){
        this.unBindUserModalData.account = null;
        this.loadUserNotInOrganization(this.bindUserModalData.organizationId, 1);
      },
      refreshBindRole(){
          this.loadBindRoleByUserOganization(this.bindUserModalData.organizationId, this.bindRoleModalData.userId, 1);
      },
      refreshUnBindRole(){
          this.loadUnBindRoleByUserOganization(this.bindUserModalData.organizationId, this.bindRoleModalData.userId, 1);
      },
      showBindUserModal(id){
        this.bindUserModal = true;
        this.bindUserModalData.organizationId = id;
        this.loadUserInOrganization(id, 1);
      },
      showUnBindUserModal(){
        this.unBindUserModal = true;
        this.loadUserNotInOrganization(this.bindUserModalData.organizationId, 1);
      },
      showBindRoleByUserOrganization(id){
        this.bindRoleModalData.userId = id;
        this.bindRoleModal = true;
        this.loadBindRoleByUserOganization(this.bindUserModalData.organizationId, this.bindRoleModalData.userId, 1);
      },
      showUnBindRoleModal(){
        this.unBindRoleModal = true;
        this.loadUnBindRoleByUserOganization(this.bindUserModalData.organizationId, this.bindRoleModalData.userId, 1);
      },
      showUserModal(){
          this.userModal = true;
          this.userModalData.modalName = "新增用户";
      },
      bindUserSelect(data){
        this.bindUserModalData.ids = common.getColumnData(data, 'id')
      },
      unBindUserSelect(data){
        this.unBindUserModalData.ids = common.getColumnData(data, 'id')
      },
      bindRoleSelect(data){
        this.bindRoleModalData.ids = common.getColumnData(data, 'id')
      },
      unBindRoleSelect(data){
        this.unBindRoleModalData.ids = common.getColumnData(data, 'id')
      },
      //获取组织下用户未绑定的角色
      loadUnBindRoleByUserOganization(organizationId, userId, page){
        //先至为空 否则会热替换
        this.unBindRoleModalData.ids = []
        let params = {
          url: '/user/organization/findUnBindRoleByOrganizationUser',
          params: {
            page,
            organizationId,
            userId
          }
        }
        this.$refs['TableUnBindRole'].load(params)
      },
      //获取组织下用户已绑定的角色
      loadBindRoleByUserOganization(organizationId, userId, page){
        //先至为空 否则会热替换
        this.bindRoleModalData.ids = []
        let params = {
          url: '/user/organization/findRoleByUserOrganization',
          params: {
            page,
            organizationId,
            userId
          }
        }
        this.$refs['TableBindRole'].load(params)
      },
      cancel() {
        this.handleReset('userModalData.formValidate')
        setTimeout(() => {
          // this.formValidate = {
          //   name: '',
          //   code: '',
          //   sort: 1,
          //   isActive: DList.Attribute.YES,
          //   parentId: null
          // }
          //清空数据
          this.userModalData.formValidate = {
            id: '',
            account: '',
            name: '',
            // accountCode: '',
            mobile: '',
            password: '',
            isActive: DList.Attribute.YES
          }
          this.SubmitLoading = false
          this.isUpdate = false
          this.userModalData.isUpdate = false
        }, 500)
      },
      //单选为组织绑定用户
      bindUserAndOrganizationById(id){
        let ids = [id]
        this.$Modal.confirm({
          title: '确认提示',
          content: '确认要绑定选择用户吗？',
          loading: true,
          onOk: () => {
            this.bindUserAndOrganization(ids)
          }
        })
      },
      //多选为组织绑定用户
      bindUserAndOrganizationBatch(){
        if (this.unBindUserModalData.ids.length == 0) {
          this.$Notice.error({
            title: '警告提示',
            desc: `请至少选择一条数据`
          })
        } else {
          this.$Modal.confirm({
            title: '确认提示',
            content: '确认要绑定选择用户吗？',
            loading: true,
            style: {"z-index": 1002},
            onOk: () => {
              this.bindUserAndOrganization(this.unBindUserModalData.ids)
            }
          })
        }
      },
      //为组织绑定用户
      bindUserAndOrganization(ids){
        this.$http.post(`/user/organization/bindUserAndOrganization?id=` + this.bindUserModalData.organizationId, ids).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.SubmitLoading = false
            if (data.code == $HTTP.SUCCESS) {
              this.unBindUserModal = false
              this.refreshBindUser();
              this.refreshUnBindUser();
              this.$Modal.remove();
              this.$Notice.success({
                title: '成功提示',
                desc: `绑定用户成功`
              })
            }
          }
        })
      },
      //单选为组织解绑用户
      unBindUserAndOrganizationById(id){
        let ids = [id]
        this.$Modal.confirm({
          title: '确认提示',
          content: '确认要解绑选择用户吗？',
          loading: true,
          onOk: () => {
            this.unBindUserAndOrganization(ids)
          }
        })
      },
      //多选为组织解绑用户
      unBindUserAndOrganizationBatch(){
        if (this.bindUserModalData.ids.length == 0) {
          this.$Notice.error({
            title: '警告提示',
            desc: `请至少选择一条数据`
          })
        } else {
          this.$Modal.confirm({
            title: '确认提示',
            content: '确认要解绑选择用户吗？',
            loading: true,
            style: {"z-index": 1002},
            onOk: () => {
              this.unBindUserAndOrganization(this.bindUserModalData.ids)
            }
          })
        }
      },
      //为组织解绑用户
      unBindUserAndOrganization(ids){
        this.$http.post(`/user/organization/unBindUserAndOrganization?id=` + this.bindUserModalData.organizationId, ids).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.SubmitLoading = false
            if (data.code == $HTTP.SUCCESS) {
              this.refreshBindUser();
              this.$Modal.remove();
              this.$Notice.success({
                title: '成功提示',
                desc: `解绑用户成功`
              })
            }
          }
        })
      },
      //单选为组织用户绑定角色
      bindRoleByUserOrganizationById(id){
        let ids = [id]
        this.$Modal.confirm({
          title: '确认提示',
          content: '确认要绑定选择用户吗？',
          loading: true,
          onOk: () => {
            this.bindRoleByUserOrganization(ids)
          }
        })
      },
      //多选为组织用户绑定角色
      bindRoleByUserOrganizationBatch(){
        if (this.unBindRoleModalData.ids.length == 0) {
          this.$Notice.error({
            title: '警告提示',
            desc: `请至少选择一条数据`
          })
        } else {
          this.$Modal.confirm({
            title: '确认提示',
            content: '确认要绑定选择角色吗？',
            loading: true,
            style: {"z-index": 1002},
            onOk: () => {
              this.bindRoleByUserOrganization(this.unBindRoleModalData.ids)
            }
          })
        }
      },
      //为组织用户绑定角色
      bindRoleByUserOrganization(ids){
        let param = 'organizationId=' + this.bindUserModalData.organizationId;
        param += '&userId=' + this.bindRoleModalData.userId;
        this.$http.post('/user/organization/bindOrganizationUserRole?' + param, ids).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.SubmitLoading = false
            if (data.code == $HTTP.SUCCESS) {
              this.unBindRoleModal = false
              this.refreshBindRole();
              this.refreshUnBindRole();
              this.$Modal.remove();
              this.$Notice.success({
                title: '成功提示',
                desc: `绑定角色成功`
              })
            }
          }
        })
      },
      //单选为组织用户解绑角色
      unBindRoleByUserOrganizationById(id){
        let ids = [id]
        this.$Modal.confirm({
          title: '确认提示',
          content: '确认要解绑选择角色吗？',
          loading: true,
          onOk: () => {
            this.unBindRoleByUserOrganization(ids)
          }
        })
      },
      //多选为组织用户解绑角色
      unBindRoleByUserOrganizationBatch(){
        if (this.bindRoleModalData.ids.length == 0) {
          this.$Notice.error({
            title: '警告提示',
            desc: `请至少选择一条数据`
          })
        } else {
          this.$Modal.confirm({
            title: '确认提示',
            content: '确认要解绑选择角色吗？',
            loading: true,
            style: {"z-index": 1002},
            onOk: () => {
              this.unBindRoleByUserOrganization(this.bindRoleModalData.ids)
            }
          })
        }
      },
      //为组织用户解绑角色
      unBindRoleByUserOrganization(ids){
        let param = 'organizationId=' + this.bindUserModalData.organizationId;
        param += '&userId=' + this.bindRoleModalData.userId;
        this.$http.post('/user/organization/unBindOrganizationUserRole?' + param, ids).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.SubmitLoading = false
            if (data.code == $HTTP.SUCCESS) {
              this.refreshBindRole();
              this.$Modal.remove();
              this.$Notice.success({
                title: '成功提示',
                desc: `解绑角色成功`
              })
            }
          }
        })
      }
    },
    watch: {
      value (val) {
        this.bindUserModal = val
        if (!!val === true) {
          this.showBindUserModal(this.id)
        }
      },
      bindUserModal (val) {
        this.$emit('input', val)
      }
    }
  }
</script>
