<template>
  <div class="tablePanel">
    <Modal v-model="formModal"
           :title="modalName"
           @on-cancel="cancel"
           width="1000px"
           :mask-closable="false">
      <Row :gutter="16">
        <Col span="12">
        <Form ref="formValidate"
              :model="formValidate"
              :rules="ruleValidate"
              :label-width="80">
          <Form-item label="营销公司名"
                     prop="name">
            <Input v-model="formValidate.name"
                   placeholder="请输入营销公司名"
                   :maxlength="20"
                   v-number-letter-chinese-symbol-only></Input>
          </Form-item>
          <Form-item label="营销公司编号"
                     prop="code">
            <Input v-model="formValidate.code"
                   placeholder="请输入营销公司编号"
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
          <!--<Form-item label="省"
                    prop="provinceName">
            <Select @on-change="findCityList" :label-in-value="true">
              <Option :value="item.provinceCode" v-for="(item, index) in provinceList">
                {{item.provinceName}}
              </Option>
            </Select>
          </Form-item>
          <Form-item label="市"
                    prop="cityName">
            <Select @on-change="findDistrictList" :label-in-value="true">
              <Option :value="item.cityCode" v-for="(item, index) in cityList">
                {{item.cityName}}
              </Option>
            </Select>
          </Form-item>
          <Form-item label="区"
                    prop="districtName">
            <Select @on-change="findStreetList" :label-in-value="true">
              <Option :value="item.districtCode" v-for="(item, index) in districtList">
                {{item.districtName}}
              </Option>
            </Select>
          </Form-item>
          <Form-item label="街道"
                    prop="streetName">
            <Select>
              <Option :value="item.streetCode" v-for="(item, index) in streetList">
                {{item.streetName}}
              </Option>
            </Select>
          </Form-item>-->
        </Form>
        </Col>
        <Col span="12">
        <div id="baidu-map-MC" style="height: 420px"></div>
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
    <div class="mb-10 d-ib">
      <Button icon="android-add"
              @click="showformModal" class="ivu-btn-default">增加营销公司
      </Button>
      <Button icon="android-remove"
              @click="updateIsDelBatch" class="ivu-btn-default">删除
      </Button>
      <Button icon="android-refresh"
              @click="refresh" class="ivu-btn-default">刷新
      </Button>
    </div>
    <Button-group style="float: right;margin-left: 10px;">
      <Button icon="android-select"
              @click="load()" class="ivu-btn-default">查询
      </Button>
    </Button-group>
    <Button-group style="float: right">
      <Input v-model="name" placeholder="请输入营销公司名称"
             :maxlength="20" class="ivu-input-default" v-number-letter-chinese-symbol-only></Input>
    </Button-group>
    <FilterTable ref="TableAccountCompany"
           :columns="columns"
           @on-selection-change="select">
    </FilterTable>
  </div>
</template>

<script>
  import FilterTable from '@/components/Table/FilterTable'
  import PageTable from '@/components/Table/PageTable'
  export default {
    name: 'MarketCompany',
    components: {
      FilterTable,
      PageTable
    },
    data() {
      return {
        DList,
        modalName: '增加营销公司',
        SubmitLoading: false,
        formModal: false,
        bindUserModal: false,
        unBindUserModal: false,
        bindRoleModal: false,
        unBindRoleModal: false,
        userModal: false,
        isUpdate: false,
        name: null,
        formValidate: {
          name: '',
          code: '',
          telephone: '',
          type: 'MLSALESCOMPANY',
          province: '',
          city: '',
          district: '',
          street: '',
          detailedAddress: '',
          longitude: '',
          latitude: '',
          isActive: 1,
          parentId: null
        },
        ruleValidate: {
          name: [
            {required: true, message: '营销公司名不能为空', trigger: 'blur'},
            {type: 'string', min: 1, max: 20, message: '营销公司名不能大于20位', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '营销公司编号不能为空', trigger: 'blur'},
            {type: 'string', min: 1, max: 10, message: '营销公司编号不能大于10位', trigger: 'blur'}
          ],
          telephone: [
            {required: true, message: '电话号不能为空', trigger: 'blur'},
            {type: 'string', min: 1, max: 12, pattern: /^(1[34578][0-9]{9})|(0\d{10,11})$/, message: '请输入正确的手机号或座机号，座机号必须输入区号', trigger: 'blur'}
          ],
          province: [
            {required: true, message: '请选择地址', trigger: 'blur'},
            {type: 'string', min: 1, max: 20, message: '请选择营销公司地址', trigger: 'blur'}
          ],
          city: [
            {required: true, message: '请选择地址', trigger: 'blur'},
            {type: 'string', min: 1, max: 20, message: '请选择营销公司地址', trigger: 'blur'}
          ],
          district: [
            {required: true, message: '请选择地址', trigger: 'blur'},
            {type: 'string', min: 1, max: 20, message: '请选择营销公司地址', trigger: 'blur'}
          ],
          detailedAddress: [
            {required: true, message: '请选择地址', trigger: 'blur'},
            {type: 'string', min: 1, max: 50, message: '详细地址不能超过50个字', trigger: 'blur'}
          ],
          isActive: [
            {type: 'number', required: true, message: '必须选择是否启用', trigger: 'change'}
          ],
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '营销公司名',
            key: 'name',
            tree: true
          },
          {
            title: '营销公司编号',
            key: 'code',
            sortable: true
          },
          {
            title: '地址',
            key: 'address',
            render: (h, {row, column, index}) => {
              return row.province + row.city + row.district + row.street + row.detailedAddress;
            }
          },
          {
            title: '联系电话',
            key: 'telephone',
            sortable: true
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
                      this.showBindUserModal(id)
                    }
                  }
                }, '用户'),
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
                      this.updateIsDelById(id)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        data: [],
        /* 百度地图所需数据 */
        baiduMap: {
          map: null,
          point: null,
          myGeo: null,
          marker: null,
        },
        provinceList: [],
        cityList: [],
        districtList: [],
        streetList: [],
        total: 0,
        page: 1,
        size: 10,
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
              {type: 'string', min: 5, max: 20, message: '用户账号不能小于5位或大于20位', trigger: 'blur'}
            ],
            name: [
              {required: true, message: '昵称不能为空', trigger: 'blur'},
              {type: 'string', min: 1, max: 20, message: '昵称不能不能小于1位或大于20位', trigger: 'blur'}
            ],
            password: [
              {/* required: true,  */message: '密码不能为空', trigger: 'blur'},
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
            ]
          },
        }
      }
    },
    mounted () {
      this.load()
      this.loadMap()
    },
    methods: {
      load() {
        let params = {
          type: 'MLSALESCOMPANY'
        }
        if (this.name != null) {
          let name = this.name
          Object.assign(params, {name})
        }
        this.$refs['TableAccountCompany'].load({
          url: '/user/organization/findAllOrganizationByTypeAndNameLike',
          params
        })
      },
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
              this.refreshBindUser(1);
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
              this.refreshBindUser(1);
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
      },
      refresh(){
          this.name = null;
          this.load();
      },
      // 百度地图API功能
      loadMap () {
        // 创建Map实例
        this.baiduMap.map = new BMap.Map("baidu-map-MC");
        // 设置初始定位点
        this.baiduMap.point = new BMap.Point(116.404, 39.915);
        // 设置地图默认的鼠标指针样式
        this.baiduMap.map.setDefaultCursor("url('bird.cur')");
        // 开启鼠标滚轮缩放功能。仅对PC上有效
        this.baiduMap.map.enableScrollWheelZoom(true);
        /* 新建图像标注 */
        this.baiduMap.marker = new BMap.Marker(this.baiduMap.point);
        /* 新建一个地址解析器的实例 */
        this.baiduMap.myGeo = new BMap.Geocoder();

        /* 配置地图控件 */
        var opts = {type: BMAP_NAVIGATION_CONTROL_SMALL}
        /* 比例尺控件 */
        this.baiduMap.map.addControl(new BMap.ScaleControl());
        /* 缩略地图控件 */
        this.baiduMap.map.addControl(new BMap.OverviewMapControl());
        /* 地图类型控件 */
        this.baiduMap.map.addControl(new BMap.MapTypeControl());
        /* 平移缩放控件 */
        this.baiduMap.map.addControl(new BMap.NavigationControl(opts));

        // 开始定位
        this.baiduMap.map.centerAndZoom(this.baiduMap.point, 15);
        /* 将标注添加到地图中 */
        this.baiduMap.map.addOverlay(this.baiduMap.marker)
        // 监听点击事件
        this.baiduMap.map.addEventListener('click', this.showInfo);
        console.log(this.baiduMap, 'baidumap')
      },
      // getLocation(name){
      //   // 创建地址解析器实例
      //   var baiduMap = this.baiduMap;
      //   // 将地址解析结果显示在地图上,并调整地图视野
      //   this.myGeo.getPoint(name, function (point) {
      //     if (point) {
      //       baiduMap.centerAndZoom(point);
      //       baiduMap.addOverlay(this.marker.setPosition(point));
      //     }
      //   }, "");
      // },
      showInfo(e){
        /* 清除所有覆盖物 */
        // this.baiduMap.clearOverlays();
        // this.baiduMap.addOverlay(this.marker);
        var _this = this;
        /* 对指定的坐标点进行反地址解析。如果解析成功，则回调函数的参数为GeocoderResult对象 */
        this.myGeo.getLocation(e.point, function (rs) {
          var addComp = rs.addressComponents;
          /* 赋值解析地址 */
          _this.formValidate.province = addComp.province
          _this.formValidate.city = addComp.city
          _this.formValidate.district = addComp.district
          _this.formValidate.street = addComp.street
          /* 赋值经纬度 */
          _this.formValidate.longitude = e.point.lat
          _this.formValidate.latitude = e.point.lng
          /* 深度复制对象实现vue子对象监听 */
          _this.formValidate = JSON.parse(JSON.stringify(_this.formValidate))
        })
      },
      /*findProvinceList(){
       this.$http.get('/lookup/address/listProvince').then(({data}) => {
       if (data.code == $HTTP.SUCCESS) {
       this.provinceList = data.data.provinceList;
       }
       }
       )
       },
       findCityList(province) {
       let provinceCode = province.value;
       if (provinceCode) {
       this.$http.get('/lookup/address/listCityByProvinceCode?provinceCode=' + provinceCode).then(({data}) => {
       if (data.code == $HTTP.SUCCESS) {
       this.cityList = data.data.cityList;
       }
       }
       )
       }
       let provinceName = province.label;
       if (provinceName) {
       this.getLocation(provinceName);
       }
       },
       findDistrictList(city){
       let cityCode = city.value;
       if (cityCode) {
       this.$http.get('/lookup/address/listDistrictByCityCode?cityCode=' + cityCode).then(({data}) => {
       if (data.code == $HTTP.SUCCESS) {
       this.districtList = data.data.districtList;
       }
       }
       )
       }
       let cityName = city.label;
       if (cityName) {
       this.getLocation(cityName);
       }
       },
       findStreetList(district){
       let districtCode = district.value;
       if (districtCode) {
       this.$http.get('/lookup/address/listStreetByDistrictCode?districtCode=' + districtCode).then(({data}) => {
       if (data.code == $HTTP.SUCCESS) {
       this.streetList = data.data.streetList;
       }
       }
       )
       }
       let districtName = district.label;
       if (districtName) {
       this.getLocation(districtName);
       }
       },*/
      pageChange(page) {
        this.page = page;
        this.load(this.page, this.size)
      },
      bindUserPageChange(page){
        this.bindUserModalData.page = page;
        this.loadUserInOrganization(this.bindUserModalData.page, this.bindUserModalData.size, this.bindUserModalData.organizationId);
      },
      unBindUserPageChange(page){
        this.unBindUserModalData.page = page;
        this.loadUserNotInOrganization(this.unBindUserModalData.page, this.unBindUserModalData.size, this.bindUserModalData.organizationId);
      },
      bindRolePageChange(page){
        this.bindRoleModalData.page = page;
        this.loadBindRoleByUserOganization(this.bindRoleModalData.page, this.bindRoleModalData.size, this.bindUserModalData.organizationId, this.bindRoleModalData.userId);
      },
      unBindRolePageChange(page){
        this.unBindRoleModalData.page = page;
        this.loadUnBindRoleByUserOganization(this.unBindRoleModalData.page, this.unBindRoleModalData.size, this.bindUserModalData.organizationId, this.bindRoleModalData.userId);
      },
      pageSizeChange(size) {
        this.size = size
        this.load(this.page, this.size)
      },
      bindUserPageSizeChange(size){
        this.bindUserModalData.size = size;
        this.loadUserInOrganization(this.bindUserModalData.page, this.bindUserModalData.size, this.bindUserModalData.organizationId);
      },
      unBindUserPageSizeChange(size){
        this.unBindUserModalData.size = size;
        this.loadUserNotInOrganization(this.unBindUserModalData.page, this.unBindUserModalData.size, this.bindUserModalData.organizationId);
      },
      bindRolePageSizeChange(size){
        this.bindRoleModalData.size = size;
        this.loadBindRoleByUserOganization(this.bindRoleModalData.page, this.bindRoleModalData.size, this.bindUserModalData.organizationId, this.bindRoleModalData.userId);
      },
      unBindRolePageSizeChange(size){
        this.unBindRoleModalData.size = size;
        this.loadUnBindRoleByUserOganization(this.unBindRoleModalData.page, this.unBindRoleModalData.size, this.bindUserModalData.organizationId, this.bindRoleModalData.userId);
      },
      select(data) {
        this.ids = common.getColumnData(data, 'id')
      },
      showformModal() {
        this.modalName = '增加营销公司'
        this.formModal = true
        // if (!this.baiduMap.map) {
        //   this.loadMap();
        // } else {
          this.baiduMap.map.centerAndZoom(this.baiduMap.point, 15);
        // }
      },
      addOrganization(name) {
        common.clearString(this.formValidate, ['name'])
        this.SubmitLoading = true;
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post('/user/organization/saveOrganization', this.formValidate).then(({data}) => {
              this.SubmitLoading = false
              if (data.code == $HTTP.SUCCESS) {
                this.formModal = false
                this.cancel()
                this.load()
                this.$Notice.success({
                  title: '成功提示',
                  desc: `添加营销公司成功`
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
                this.formModal = false
                this.cancel()
                this.load()
                this.$Notice.success({
                  title: '成功提示',
                  desc: `修改营销公司成功`
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
      addChild(id) {
        this.modalName = '增加子营销公司'
        this.formValidate.parentId = id
        this.formModal = true
      },
      updateById(id) {
        this.modalName = '修改营销公司'
        this.formModal = true
        this.isUpdate = true
        // if (!this.baiduMap) {
        //   this.loadMap();
        //   var vue = this;
        //   this.baiduMap.addEventListener('load', function () {
        //     vue.loadDataForUpdate(id)
        //   });
        // } else {
          this.loadDataForUpdate(id)
        // }
      },
      loadDataForUpdate(id){
        this.$http.get(`/user/organization/findOrganizationById?id=${id}`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.$watch("formValidate", function (newData) {
              var addressName = newData.province + newData.city + newData.district +
                newData.street + newData.detailedAddress;
              //若同时为空则默认定位到北京市
              if (!newData.province && !newData.city && !newData.district
                && !newData.street && !newData.detailedAddress) {
                addressName = "北京市";
              }
              this.getLocation(addressName);
            });
            this.formValidate = data.data
          }
        })
      },
      deleteById(id, cl) {
        if (cl > 0) {
          this.$Notice.error({
            title: '警告提示',
            desc: `请先删除子营销公司`
          })
        } else {
          this.$Modal.confirm({
            title: '确认提示',
            content: '确认删除此营销公司吗？',
            loading: true,
            onOk: () => {
              this.$http.delete(`/user/organization?id=${id}`).then(({data}) => {
                if (data.code == $HTTP.SUCCESS) {
                  this.$Modal.remove()
                  this.load()
                  this.$Notice.success({
                    title: '成功提示',
                    desc: `删除营销公司成功`
                  })
                }
              })
            }
          })
        }
      },
      updateIsActive(ids, isActive) {
        this.$http.put(`/user/organization/updateIsActive?isActive=${isActive}`, ids).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.$Modal.remove()
            this.load()
            if (DList.Attribute.YES == isActive) {
              this.$Notice.success({
                title: '成功提示',
                desc: `启用营销公司成功`
              })
            } else {
              this.$Notice.success({
                title: '成功提示',
                desc: `禁用营销公司成功`
              })
            }

          }
        })
      },
      updateIsActiveById(id, isActive, index) {
        let ids = [id]
        let message
        if (DList.Attribute.YES == isActive) {
          message = '确认要启用营销公司吗？'
        } else {
          if (index < 3) {
            message = '确认要禁用此营销公司吗？禁用后，子营销公司也无法访问'
          } else {
            message = '确认要禁用营销公司吗？'
          }
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
      updateIsDel(ids) {
        this.$http.post(`/user/organization/updateIsDelByIds?isDel=` + DList.Attribute.YES, ids).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.$Modal.remove()
            this.load(1, 10)
            this.$Notice.success({
              title: '成功提示',
              desc: `删除营销公司成功`
            })
          }
        })
      },
      updateIsDelById(id) {
        let ids = [id]
        this.$Modal.confirm({
          title: '确认提示',
          content: '确认要删除营销公司吗？',
          loading: true,
          onOk: () => {
            this.updateIsDel(ids)
          }
        })
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
            content: '确认要删除营销公司吗？',
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
