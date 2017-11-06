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
        <Form-item label="菜单名"
                   prop="name">
          <Input v-model="formValidate.name"
                 placeholder="请输入菜单名"
                 :maxlength="6"></Input>
        </Form-item>
        <Form-item v-if="!formValidate.parentId"
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
        <Form-item v-if="formValidate.parentId"
                   label="链接"
                   prop="link">
          <Input v-model="formValidate.link"
                 placeholder="请输入链接"
                 :maxlength="50"></Input>
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
        <Form-item label="排序"
                   prop="sort">
          <Input-number :min="1"
                        :step="1"
                        v-model="formValidate.sort"></Input-number>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button v-if="isUpdate"
                :loading="SubmitLoading"
                @click="updateMenu('formValidate')">提交
        </Button>
        <Button v-else
                :loading="SubmitLoading"
                @click="addMenu('formValidate')">提交
        </Button>
      </div>
    </Modal>
    <Button-group>
      <Button icon="android-add"
              @click="showformModal">增加顶级菜单
      </Button>
      <Button icon="android-refresh"
              @click="load">刷新
      </Button>
    </Button-group>
    <TreeTable :columns="columns"
               :data="data">
    </TreeTable>
  </div>
</template>
<script>
  export default {
    name: 'Menu',
    data() {
      return {
        DList,
        modalName: '增加菜单',
        SubmitLoading: false,
        formModal: false,
        isUpdate: false,
        icon: ['android-add',
          'android-settings',
          'android-remove',
          'android-refresh',
          'ionic',
          'arrow-up-a',
          'arrow-right-a',
          'arrow-down-a',
          'arrow-left-a',
          'arrow-up-b',
          'arrow-right-b',
          'arrow-down-b',
          'arrow-left-b',
          'arrow-up-c',
          'arrow-right-c',
          'arrow-down-c',
          'arrow-left-c',
          'arrow-return-right',
          'arrow-return-left',
          'arrow-swap',
          'arrow-shrink',
          'arrow-expand'],
        formValidate: {
          name: '',
          icon: '',
          link: '',
          sort: 1,
          isActive: DList.Attribute.YES,
          parentId: null
        },
        ruleValidate: {
          name: [
            {required: true, message: '菜单名不能为空', trigger: 'blur'},
            {type: 'string', min: 1, max: 6, message: '菜单名不能大于6位', trigger: 'blur'}
          ],
          icon: [
            {required: true, message: '必须选择图标', trigger: 'change'}
          ],
          link: [
            {required: true, message: '链接不能为空', trigger: 'blur'},
            {type: 'string', min: 1, max: 50, message: '链接不能大于50位', trigger: 'blur'}
          ],
          sort: [
            {type: 'number', required: true, message: '排序不能为空', trigger: 'blur'}
          ],
          isActive: [
            {type: 'number', required: true, message: '必须选择是否启用', trigger: 'change'}
          ],
        },
        columns: [
          {
            title: '菜单名',
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
          {
            title: '链接',
            key: 'link'
          },
          {
            title: '排序',
            key: 'sort'
          },
          {
            title: '是否启用',
            key: 'isActive',
            render(row, column, index) {
              if (row.isActive == DList.Attribute.YES) {
                return `<span class="text-green">启用</span>`
              } else {
                return `<span class="text-red">禁用</span>`
              }
            }
          },
          {
            title: '操作',
            key: 'action',
            render(row, column, index) {
              let id = row.id
              let childrenLength = row.children.length
              let append;
              if (row.isActive == DList.Attribute.YES) {
                append = `<i-button type="text" size="small" @click="updateIsActiveById(${id},${DList.Attribute.NO},${index})">禁用</i-button>`
              } else {
                append = `<i-button type="text" size="small" @click="updateIsActiveById(${id},${DList.Attribute.YES},${index})">启用</i-button>`
              }
              if (index == 3) {
                let button = append
                button += `<i-button type="text" size="small" @click="updateById(${id})">编辑</i-button>`
                button += `<i-button type="text" size="small" @click="deleteById(${id},${childrenLength})">删除</i-button>`
                return button
              } else {
                let button = `<i-button type= "text" size= "small" @click="addChild(${id})">增加子菜单</i-button>`
                button += append
                button += `<i-button type= "text" size= "small" @click="updateById(${id})">编辑</i-button>
                                    <i-button type= "text" size= "small" @click="deleteById(${id},${childrenLength})">删除</i-button>`
                return button
              }
            }
          }
        ],
        data: []
      }
    },
    created() {
      this.load()
    },
    methods: {
      load() {
        //先至为空 否则会热替换
        this.data = []
        //获取菜单
        this.$http.get('/user/resource/findAllResourceByType?type=MENU').then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.data = data.data
          }
        })
      },
      cancel() {
        this.handleReset('formValidate')
        setTimeout(() => {
          this.formValidate = {
            name: '',
            icon: '',
            link: '',
            sort: 1,
            isActive: DList.Attribute.YES,
            parentId: null
          }
          this.SubmitLoading = false
          this.isUpdate = false
        }, 500)
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      showformModal() {
        this.modalName = '增加顶级菜单'
        this.formValidate.link = '#'
        this.formModal = true
      },
      addMenu(name) {
        this.SubmitLoading = true;
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post('/user/menu', this.formValidate).then(({data}) => {
              this.SubmitLoading = false
              if (data.code == $HTTP.SUCCESS) {
                this.formModal = false
                this.cancel()
                this.load()
                this.$Notice.success({
                  title: '成功提示',
                  desc: `添加菜单成功`
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
      updateMenu(name) {
        this.SubmitLoading = true;
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.put('/user/menu', this.formValidate).then(({data}) => {
              this.SubmitLoading = false
              if (data.code == $HTTP.SUCCESS) {
                this.formModal = false
                this.cancel()
                this.load()
                this.$Notice.success({
                  title: '成功提示',
                  desc: `修改菜单成功`
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
        this.modalName = '增加子菜单'
        this.formValidate.parentId = id
        this.formValidate.link = '#'
        this.formModal = true
      },
      updateById(id) {
        this.modalName = '修改菜单'
        this.isUpdate = true
        this.$http.get(`/user/menu?id=${id}`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.formModal = true
            this.formValidate = data.data
          }
        })
      },
      deleteById(id, cl) {
        if (cl > 0) {
          this.$Notice.error({
            title: '警告提示',
            desc: `请先删除子菜单`
          })
        } else {
          this.$Modal.confirm({
            title: '确认提示',
            content: '确认删除此菜单吗？',
            loading: true,
            onOk: () => {
              this.$http.delete(`/user/menu?id=${id}`).then(({data}) => {
                if (data.code == $HTTP.SUCCESS) {
                  this.$Modal.remove()
                  this.load()
                  this.$Notice.success({
                    title: '成功提示',
                    desc: `删除菜单成功`
                  })
                }
              })
            }
          })
        }
      },
      updateIsActive(ids, isActive) {
        this.$http.put(`/user/menu/updateIsActive?isActive=${isActive}`, ids).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.$Modal.remove()
            this.load()
            if (DList.Attribute.YES == isActive) {
              this.$Notice.success({
                title: '成功提示',
                desc: `启用菜单成功`
              })
            } else {
              this.$Notice.success({
                title: '成功提示',
                desc: `禁用菜单成功`
              })
            }

          }
        })
      },
      updateIsActiveById(id, isActive, index) {
        let ids = [id]
        let message
        if (DList.Attribute.YES == isActive) {
          message = '确认要启用菜单吗？'
        } else {
          if (index < 3) {
            message = '确认要禁用此菜单吗？禁用后，子菜单也无法访问'
          } else {
            message = '确认要禁用菜单吗？'
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
      }
    }
  }
</script>
