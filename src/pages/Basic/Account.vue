<template>
  <div class="tablePanel">
    <Modal v-model="formModal"
           :title="modalName"
           @on-cancel="cancel"
           :mask-closable="false">
      <Form ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="80">
        <Form-item label="用户昵称"
                   prop="name">
          <Input v-model="formValidate.name"
                 placeholder="请输入用户昵称"
                 :maxlength="10"
                 v-number-letter-chinese-only></Input>
        </Form-item>
        <!--<Form-item v-if="!isUpdate"
                   label="用户账号"
                   prop="account">
          <Input v-model="formValidate.account"
                 placeholder="请输入用户账号"
                 :maxlength="20"></Input>
        </Form-item>-->
        <Form-item label="手机号"
                   prop="mobile">
          <Input v-model="formValidate.mobile"
                 placeholder="请输入用户手机号"
                 :maxlength="11"></Input>
        </Form-item>
        <Form-item ref="formItemPassword"
                   label="密码"
                   prop="password">
          <Input type="password" v-model="formValidate.password"
                 :placeholder="isUpdate ? '不输入新密码则表示不修改密码' : '请输入用户密码'"
                 :maxlength="20"
                 v-number-letter-symbol-only></Input>
        </Form-item>
        <!-- <Form-item label="用户工号"
                   prop="accountCode">
          <Input v-model="formValidate.accountCode"
                 placeholder="请输入用户工号"
                 :maxlength="20"></Input>
        </Form-item> -->
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
      <div slot="footer">
        <Button v-if="isUpdate"
                :loading="SubmitLoading"
                @click="updateAccount('formValidate')">提交
        </Button>
        <Button v-else
                :loading="SubmitLoading"
                @click="addAccount('formValidate')">提交
        </Button>
      </div>
    </Modal>
    <!-- 已绑定系统角色 -->
    <Modal v-model="BindSysRoleModel"
           title="已绑定系统角色"
           width="900">
        <div class="mb-10 d-ib">
          <Button icon="android-add"
                  @click="showUnBindSysRoleModel" class="ivu-btn-default">增加
          </Button>
          <Button icon="android-remove"
                  @click="unBindUserSysRoleBatch" class="ivu-btn-default">解绑
          </Button>
          <Button icon="android-refresh"
                  @click="refreshBindSystemRole" class="ivu-btn-default">刷新
          </Button>
        </div>
        <PageTable ref="TableBindSystemRole" style="margin-top: 10px"
               :columns="BindSysRoleColumns" :showSizer="false"
               @on-selection-change="BindSysRoleSelect">
        </PageTable>
      <div slot="footer">

      </div>
    </Modal>
    <!-- 角色列表 -->
    <Modal v-model="UnBindSysRoleModel"
           title="角色列表"
           width="900">
      <Button-group>
        <Button icon="android-add"
                @click="bindUserSysRoleBatch">绑定
        </Button>
        <Button icon="android-refresh"
                @click="refreshUnBindSystemRole">刷新
        </Button>
      </Button-group>
      <PageTable ref="TableUnBindSysRole"
             style="margin-top: 10px"
             :columns="UnBindSysRoleColumns" :showSizer="false"
             @on-selection-change="UnBindSysRoleSelect">
      </PageTable>
    </Modal>
    <Modal v-model="AccountInfoModel"
           title="用户详细信息"
           width="900">
      <!-- <div>
        用户头像：{{AccountInfo.avatarSrc}}
      </div> -->
      <div class="ivu-information-box p-20 clearfix">
        <div class="ivu-information-box-img f-l" style="background-color: #f0f0f0">
          <img :src="AccountInfo.avatarSrc" alt="">
        </div>
        <div class="ivu-information-box-text f-l ml-30 f-14 clearfix">
            <ul class="ta-r f-l">
              <li>用户名称：</li>
              <li>用户编号：</li>
              <li>手机号：</li>
              <li>审核状态：</li>
            </ul>
            <ul class="ta-l f-l">
              <li class="color-blue">{{ AccountInfo.account || '暂无' }}</li>
              <li>{{ AccountInfo.accountCode || '暂无' }}</li>
              <li>{{ AccountInfo.mobile || '暂无' }}</li>
              <li>{{ AccountInfo.auditStatus || '暂无' }}</li>
            </ul>
        </div>
      </div>
      <Tabs type="card" style="margin-top: 20px">
          <TabPane label="用户绑定的角色">
            <Table border :columns="columnsRoleInOrganization" :data="dataRoleInOrganization"></Table>
          </TabPane>
      </Tabs>
      <div slot="footer">
        <Button @click="closeAccountInfoModel">确认
        </Button>
      </div>
    </Modal>
    <div class="clearfix">
      <div class="mb-10 d-ib">
        <Button icon="android-add"
                @click="showformModal" class="ivu-btn-default">增加
        </Button>
        <Button icon="android-remove"
                @click="updateIsDelBatch" class="ivu-btn-default">删除
        </Button>
        <Button icon="unlocked"
                @click="updateIsActiveBatch(DList.Attribute.YES)" class="ivu-btn-default">启用
        </Button>
        <Button icon="locked"
                @click="updateIsActiveBatch(DList.Attribute.NO)" class="ivu-btn-default">禁用
        </Button>
        <Button icon="android-refresh"
                @click="refresh" class="ivu-btn-default">刷新
        </Button>
      </div>
      <Button-group style="float: right;margin-left: 10px;">
        <Button icon="android-search"
                @click="load(1, 10)" class="ivu-btn-default">查询
        </Button>
      </Button-group>
      <Button-group style="float: right">
        <Input v-model="account" placeholder="请输入用户名"
              :maxlength="20" class="ivu-input-default"
              v-number-letter-chinese-only></Input>
      </Button-group>
    </div>
    <PageTable id="table001" ref="accountTable"
           :columns="columns"
           mode="transfer"
           :export-excel="false"
           @on-selection-change="select">
    </PageTable>
  </div>
</template>

<script>
  import PageTable from '@/components/Table/PageTable'
  export default {
    name: 'Account',
    components: {
      PageTable
    },
    data() {
      return {
        context: this,
        DList,
        modalName: '增加用户',
        SubmitLoading: false,
        formModal: false,
        isUpdate: false,
        account:'',
        auditStatus: [
          {
            value: 'WAITTING',
            label: '待确认',
            class: 'text-green'
          },
          {
            value: 'PASS',
            label: '通过',
            class: 'ligth-blue'
          },
          {
            value: 'REJECT',
            label: '拒绝',
            class: 'text-red'
          }
        ],
        formValidate: {
          account: '',
          name: '',
          // accountCode: '',
          mobile: '',
          password: '',
          isActive: DList.Attribute.YES,
        },
        ruleValidate: {
          account: [
            {required: true, message: '用户账号不能为空', trigger: 'blur'},
            {type: 'string', min: 5, max: 20, message: '用户账号不能小于5位或大于20位', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '用户昵称不能为空', trigger: 'blur'},
            {type: 'string', min: 1, max: 10, message: '昵称不能不能小于1位或大于10位', trigger: 'blur'}
          ],
          password: [
            // 编辑时为可选
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {pattern: /^[0-9a-zA-Z]*$/, message: '只允许输入数字或字母', trigger: 'blur'},
            {type: 'string', min: 6, max: 20, message: '用户密码不能小于6位或大于20位', trigger: 'blur'}
          ],
          // accountCode: [
          //   {required: true, message: '用户工号不能为空', trigger: 'blur'},
          //   {pattern: /^[1-9]+[0-9]*]*$/, message: '只允许输入数字', trigger: 'blur'},
          //   {type: 'string', min: 1, max: 20, message: '用户工号不能大于20位', trigger: 'blur'}
          // ],
          mobile: [
            {required: true, message: '手机号不能为空', trigger: 'blur'},
            {type: 'string', pattern: /^1[34578]\d{9}$/, message: '输入手机号不符合规范', trigger: 'blur'}
          ],
          isActive: [
            {type: 'number', required: true, message: '必须选择是否启用', trigger: 'change'}
          ],
          'role.id': [
            {type: 'number', required: true, message: '必须选择角色', trigger: 'change'}
          ],
          'organization.name': [
            {required: true, message: '组织不能为空', trigger: 'blur'}
          ]
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '用户名',
            key: 'account',
            render: (h, {row, column, index}) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.AccountInfo = row;
                      this.showAccountInfoModel()
                    }
                  }
                }, row.account)
              ]);
            }
          },
          {
            title: '用户昵称',
            key: 'name'
          },
          {
            title: '用户工号',
            key: 'accountCode'
          },
          {
            title: '手机号',
            key: 'mobile'
          },
          {
            title: '审核状态',
            key: 'auditStatus',
            render: (h, {row, column, index}) => {
              let auditStatus = row.auditStatus
              let idx
              this.auditStatus.map((item, _index) => {
                if (item.value === auditStatus) {
                  idx = _index
                }
              })
              let _class = this.auditStatus[idx].class
              let label = this.auditStatus[idx].label
                return h('div', [
                    h('span', {
                        class: _class
                    }, label)
                ]);
            }
          },
          {
            title: '是否启用',
            key: 'isActive',
            render: (h, {row, column, index}) => {
              let isActive = row.isActive;
                return h('div', [
                    h('span', {
                        class: isActive == DList.Attribute.YES ? ['ligth-blue'] : ['text-red']
                    }, isActive == DList.Attribute.YES ? '启用' : '禁用')
                ]);
            }
          },
          {
            title: '操作',
            key: 'action',
            render: (h, {row, column, index}) => {
                let id = row.id
                let isActive = row.isActive;
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
                                this.showBindSysRoleModel(id)
                            }
                        }
                    }, '系统角色权限'),
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
                      on: {
                        click: () => {
                            if(isActive == DList.Attribute.YES){
                              this.updateIsActiveById(id, DList.Attribute.NO)
                            }
                            if(isActive == DList.Attribute.NO){
                              this.updateIsActiveById(id, DList.Attribute.YES)
                            }
                        }
                      }
                    }, isActive == DList.Attribute.YES ? '禁用':'开启'),
                    h('Button', {
                      props: {
                        type: 'text',
                        size: 'small'
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
        data: [],
        total: 0,
        page: 1,
        size: 10,
        ids: [],
        BindSysRoleModel: false,
        UnBindSysRoleModel: false,
        AccountInfoModel: false,
        UnBindSysRoleColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '角色名称',
            key: 'name',
            tree: true
          },
          {
            title: '角色表述',
            key: 'desc',
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
                  on: {
                    click: () => {
                      this.bindUserSysRole(id)
                    }
                  }
                }, '绑定')
              ]);
            }
          }
        ],
        BindSysRoleColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '角色名称',
            key: 'name',
            tree: true
          },
          {
            title: '角色表述',
            key: 'desc',
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
                  on: {
                    click: () => {
                      this.unBindUserSysRole(id)
                    }
                  }
                }, '解绑')
              ]);
            }
          }
        ],
        UnBindSysRoleData: [],
        UnBindTotal: 0,
        UnBindPage: 1,
        UnBindSize: 10,
        BindSysRoleData: [],
        BindTotal: 0,
        BindPage: 1,
        BindSize: 10,
        chooseUser: null,
        UnBindSysRoleIds: [],
        BindSysRoleIds: [],
        AccountInfo: {
          avatarSrc: /* require('../../img/pledge.png') */'../static/img/photo.png'
        },
        columnsRoleInOrganization: [
          {
            title: '角色名',
            key: 'roleName',
          },
          {
            title: '组织/系统角色',
            key: 'organizationName'
          }
        ],
        dataRoleInOrganization: []
      }
    },
    mounted() {
      this.load()
    },
    methods: {
      refresh() {
        this.account = '';
        this.load()
      },
      switchTab(index) {
        switch (index) {
          default:
            this.loadUserRole2Organization()
        }
      },
      refreshBindSystemRole(){
          this.loadBindSysRole(1)
      },
      refreshUnBindSystemRole(){
        this.loadUnBindSysRole();
      },
      loadBindSysRole(page) {
        this.$refs['TableBindSystemRole'].load({
          url: '/user/role/findBindSystemRoleList',
          params: {
            userId: this.chooseUser,
            page
          }
        })
      },
      loadUnBindSysRole(page, size) {
        this.UnBindSysRoleIds = []
        let userId = this.chooseUser
        this.$refs['TableUnBindSysRole'].load({
          url: '/user/role/findUnBindSystemRoleList',
          params: {
            userId
          }
        })
      },
      load(page, size) {
        this.ids = []
        let account = this.account
        this.$refs['accountTable'].load({
          url: '/user/user/findUserByPage',
          params: {
            account,
            page,
            size
          }
        })
      },
      showBindSysRoleModel(userId){
          this.BindSysRoleModel = true;
          this.chooseUser = userId;
          this.loadBindSysRole(1);
      },
      showUnBindSysRoleModel(){
        this.UnBindSysRoleModel = true;
        this.loadUnBindSysRole();
      },
      showAccountInfoModel(){
        this.AccountInfoModel = true;
        console.log(this.AccountInfo, 777)
        let headPicId = this.AccountInfo.headPic
        let id = this.AccountInfo.id
        this.loadUserAvatar(headPicId)
        this.loadUserRole2Organization(id)
      },
      closeAccountInfoModel () {
        this.AccountInfoModel = false
      },
      loadUserAvatar(id) {
        if (!id) { return }
        this.$http.get(`/document/document/getDocumentByID?documentID=${id}`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            let cdata = data.data
            this.$set(this.AccountInfo, 'avatarSrc', cdata.Document.accessUrl)
          }
        })
      },
      loadUserRole2Organization(id) {
        this.dataRoleInOrganization = []
        this.$http.get(`/user/user/findUserOrganizationRoleListByUserId?userId=${id}`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            let cdata = data.data
            this.dataRoleInOrganization = cdata
            this.dataRoleInOrganization.map((item, index) => {
              item.organizationName = item.organization ? item.organization.name : '暂无'
              item.roleName = item.role ? item.role.name : '暂无'
            })
          }
        })
      },
      //单选绑定系统角色
      bindUserSysRole(id){
        let ids = [id]
        this.$Modal.confirm({
          title: '确认提示',
          content: '确认要绑定选择角色吗？',
          loading: true,
          onOk: () => {
            this.bindSysRole(ids)
          }
        })
      },
      //多选绑定系统角色
      bindUserSysRoleBatch(){
        if (this.UnBindSysRoleIds.length == 0) {
          this.$Notice.error({
            title: '警告提示',
            desc: `请至少选择一条数据`
          })
        } else {
          this.$Modal.confirm({
            title: '确认提示',
            content: '确认要绑定选择角色吗？',
            loading: true,
            style: {"z-index":1002},
            onOk: () => {
              this.bindSysRole(this.UnBindSysRoleIds)
            }
          })
        }
      },
      //绑定系统角色
      bindSysRole(ids){
        this.$http.post(`/user/user/bindUserSysRoles?userId=` + this.chooseUser, ids).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.SubmitLoading = false
            if (data.code == $HTTP.SUCCESS) {
              this.UnBindSysRoleModel = false
              this.loadBindSysRole(1);
              this.$Modal.remove();
              this.$Notice.success({
                title: '成功提示',
                desc: `绑定角色成功`
              })
            }
          }
        })
      },
      //单选解绑系统角色
      unBindUserSysRole(id){
        let ids = [id]
        this.$Modal.confirm({
          title: '确认提示',
          content: '确认要解绑选择角色吗？',
          loading: true,
          onOk: () => {
            this.unBindSysRole(ids)
          }
        })
      },
      //多选解绑系统角色
      unBindUserSysRoleBatch(){
        if (this.BindSysRoleIds.length == 0) {
          this.$Notice.error({
            title: '警告提示',
            desc: `请至少选择一条数据`
          })
        } else {
          this.$Modal.confirm({
            title: '确认提示',
            content: '确认要解绑选择角色吗？',
            loading: true,
            style: {"z-index":1002},
            onOk: () => {
              this.unBindSysRole(this.BindSysRoleIds)
            }
          })
        }
      },
      //解绑系统角色
      unBindSysRole(ids){
        this.$http.post(`/user/user/unBindUserSysRoles?userId=` + this.chooseUser, ids).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.SubmitLoading = false
            if (data.code == $HTTP.SUCCESS) {
              this.UnBindSysRoleModel = false
              this.loadBindSysRole(1);
              this.$Modal.remove();
              this.$Notice.success({
                title: '成功提示',
                desc: `解绑角色成功`
              })
            }
          }
        })
      },
      setPage(type, cdata){
          if("Bind" == type){
            this.BindTotal = cdata.totalElements;
            this.BindSize = cdata.size;
            this.BindPage = cdata.number + 1;
          }else if("UnBind" == type){
            this.UnBindTotal = cdata.totalElements;
            this.UnBindSize = cdata.size;
            this.UnBindPage = cdata.number + 1;
          }else{
            this.total = cdata.totalElements;
            this.size = cdata.size;
            this.page = cdata.number + 1;
          }
      },
      pageChange(page) {
        this.page = page;
        this.load(this.page, this.size)
      },
      pageSizeChange(size) {
        this.size = size
        this.load(this.page, this.size)
      },
      UnBindPageChange(page) {
        this.UnBindPage = page;
        this.loadUnBindSysRole(this.UnBindPage, this.UnBindSize);
      },
      UnBindPageSizeChange(size) {
        this.UnBindSize = size
        this.loadUnBindSysRole(this.UnBindPage, this.UnBindSize);
      },
      BindPageChange(page) {
        this.BindPage = page;
        this.loadBindSysRole(this.BindPage, this.BindSize);
      },
      BindPageSizeChange(size) {
        this.BindSize = size
        this.loadBindSysRole(this.BindPage, this.BindSize);
      },
      select(data) {
        this.ids = common.getColumnData(data, 'id')
      },
      BindSysRoleSelect(data) {
        this.BindSysRoleIds = common.getColumnData(data, 'id')
      },
      UnBindSysRoleSelect(data){
        this.UnBindSysRoleIds = common.getColumnData(data, 'id');
      },
      setOrganization(id, name) {
        this.formValidate.organization.id = id
        this.formValidate.organization.name = name
        this.OrganizationModal = false
      },
      cancel() {
        this.handleReset('formValidate')
        setTimeout(() => {
          this.formValidate = {
            account: '',
            name: '',
            mobile: '',
            // accountCode: '',
            password: '',
            isActive: DList.Attribute.YES,
          }
          this.SubmitLoading = false
          this.isUpdate = false
        }, 500)
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      showformModal() {
        this.modalName = '增加用户'
        this.formModal = true
      },
      addAccount(name) {
        common.clearString(this.formValidate, ['name'/* , 'accountCode' */])
        this.SubmitLoading = true;
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.formValidate.account = this.formValidate.mobile;
            this.formValidate.name = common.delHtmlTag(this.formValidate.name)
            this.$http.post('/user/user/addUser', this.formValidate).then(({data}) => {
              this.SubmitLoading = false
              if (data.code == $HTTP.SUCCESS) {
                this.formModal = false
                this.cancel()
                this.load(1, 10)
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
        common.clearString(this.formValidate, ['name'/* , 'accountCode' */])
        this.SubmitLoading = true;
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post('/user/user/updateUser', this.formValidate).then(({data}) => {
              this.SubmitLoading = false
              if (data.code == $HTTP.SUCCESS) {
                this.formModal = false
                this.cancel()
                this.load(1, 10)
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
      updateById(id) {
        this.modalName = '修改用户'
        this.isUpdate = true
        this.$http.get(`/user/user/findUserByUserId?userId=${id}`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.formModal = true
            this.formValidate = {
              id: data.data.data.id,
              name: data.data.data.name,
              // accountCode: data.data.data.accountCode,
              mobile: data.data.data.mobile,
              password: "",
              isActive: data.data.data.isActive,
            }
          }
        })
      },
      updateIsDel(ids) {
        this.$http.post(`/user/user/updateIsDelByIds?isDel=` + DList.Attribute.YES, ids).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.$Modal.remove()
            this.load(1, 10)
            this.$Notice.success({
              title: '成功提示',
              desc: `删除用户成功`
            })
          }
        })
      },
      updateIsActive(ids, isActive) {
        this.$http.post(`/user/user/updateUserIsActive?isActive=` + isActive, ids).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.$Modal.remove()
            this.load(1, 10)
            if (DList.Attribute.YES == isActive) {
              this.$Notice.success({
                title: '成功提示',
                desc: `启用用户成功`
              })
            } else {
              this.$Notice.success({
                title: '成功提示',
                desc: `禁用用户成功`
              })
            }

          }
        })
      },
      updateIsActiveById(id, isActive) {
        let ids = [id]
        let message
        if (DList.Attribute.YES == isActive) {
          message = '确认要启用用户吗？'
        } else {
          message = '确认要禁用用户吗？'
        }
        this.$Modal.confirm({
          title: '确认提示',
          content: message,
          loading: true,
          onOk: () => {
            this.updateIsActive(ids, isActive)
          }
        })
      },
      updateIsDelById(id) {
        let ids = [id]
        this.$Modal.confirm({
          title: '确认提示',
          content: '确认要删除用户吗？',
          loading: true,
          onOk: () => {
            this.updateIsDel(ids)
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
            message = '确认要启用用户吗？'
          } else {
            message = '确认要禁用用户吗？'
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
            content: '确认要删除用户吗？',
            loading: true,
            onOk: () => {
              this.updateIsDel(this.ids)
            }
          })
        }
      },
      switchPasswordValidate (v) {
        this.ruleValidate.password.find((item) => {
          return Object.keys(item).includes('required')
        }).required = !v
        this.$refs['formItemPassword'].$forceUpdate()
      }
    },
    watch: {
      isUpdate (v) {
        this.switchPasswordValidate(v)
      }
    }
  }
</script>

<style scoped>
  .ivu-title-name{
    flex: 1;
    border-bottom:1px solid #dddee1;
    line-height: 32px;
  }
  .ivu-information-box-img{
    vertical-align: top;
    width:75px;
    height: 100px;
  }
  .ivu-information-box-text ul li{
    padding-top:8px;
  }
  .ivu-information-box-text ul li:first-child{
    padding-top: 0;
  }
  .ivu-tabs-text .w-sty1{
    min-width: 300px;
    width:300px;
    line-height: 35px;
  }
  .ivu-tabs-text .w-sty1 .ta-r{
    min-width: 75px;
    width:75px;
  }
  .ivu-tabs-text .flex img{
    width:200px;
    height: 120px;
  }

</style>
