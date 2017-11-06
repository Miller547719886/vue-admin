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
        <Form-item v-if="!formValidate.parentId"
                   label="分类名"
                   prop="title">
          <Input v-model="formValidate.name"
                 placeholder="请输入分类名"
                 :maxlength="20"></Input>
        </Form-item>
        <Form-item v-else
                   label="标题名"
                   prop="title">
          <Input v-model="formValidate.name"
                 placeholder="请输入标题名"
                 :maxlength="20"></Input>
        </Form-item>
        <Form-item v-if="formValidate.parentId"
                   label="请求方式"
                   prop="method">
          <Select v-model="formValidate.method">
            <Option v-for="item in method"
                    :value="item"
                    :label="item"
                    key="item">
              <span>{{item}}</span>
            </Option>
          </Select>
        </Form-item>
        <Form-item v-if="formValidate.parentId"
                   label="链接"
                   prop="url">
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
      </Form>
      <div slot="footer">
        <Button v-if="isUpdate"
                :loading="SubmitLoading"
                @click="updateUrl('formValidate')">提交
        </Button>
        <Button v-else
                :loading="SubmitLoading"
                @click="addUrl('formValidate')">提交
        </Button>
      </div>
    </Modal>
    <Button-group>
      <Button icon="android-add"
              @click="showformModal">增加分类
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
    name: 'Url',
    data() {
      return {
        DList,
        modalName: '增加链接',
        SubmitLoading: false,
        formModal: false,
        isUpdate: false,
        method: ['GET', 'POST', 'PUT', 'DELETE'],
        formValidate: {
          name: '',
          method: 'GET',
          link: '',
          isActive: DList.Attribute.YES,
          parentId: null
        },
        ruleValidate: {
          name: [
            {required: true, message: '标题不能为空', trigger: 'blur'},
            {type: 'string', min: 1, max: 20, message: '标题不能小于1位或大于20位', trigger: 'blur'}
          ],
          method: [
            {type: 'string', required: true, message: '必须选择请求方式', trigger: 'change'}
          ],
          link: [
            {required: true, message: '链接不能为空', trigger: 'blur'},
            {type: 'string', min: 1, max: 50, message: '链接不能小于1位或大于50位', trigger: 'blur'}
          ],
          isActive: [
            {type: 'number', required: true, message: '必须选择是否启用', trigger: 'change'}
          ],
        },
        columns: [
          {
            title: '分类或标题',
            key: 'name',
            tree: true,
          },
          {
            title: '请求方式',
            key: 'link',
            render(row, column, index) {
              if (row.parentId) {
                return row.link.split(":")[0]
              }
              return ''
            }
          },
          {
            title: '链接',
            key: 'link',
            render(row, column, index) {
              if (row.parentId) {
                return row.link.split(":")[1]
              }
              return ''
            }
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
              if (index == 2) {
                let button = append
                button += `<i-button type="text" size="small" @click="updateById(${id})">编辑</i-button>`
                button += `<i-button type="text" size="small" @click="deleteById(${id},${childrenLength},${index})">删除</i-button>`
                return button
              } else {
                let button = `<i-button type= "text" size= "small" @click="addChild(${id})">增加链接</i-button>`
                button += append
                button += `<i-button type= "text" size= "small" @click="updateById(${id})">编辑</i-button>
                                    <i-button type= "text" size= "small" @click="deleteById(${id},${childrenLength},${index})">删除</i-button>`
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
        //获取链接
        this.$http.get('/user/url/findAll').then(({data}) => {
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
            method: 'GET',
            link: '',
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
        this.modalName = '增加分类'
        this.formModal = true
      },
      addUrl(name) {
        let resultMessage
        if (this.formValidate.parentId) {
          resultMessage = `添加链接成功`
          this.ruleValidate.name = [
            {required: true, message: '标题不能为空', trigger: 'blur'},
            {type: 'string', min: 1, max: 20, message: '标题不能小于1位或大于20位', trigger: 'blur'}
          ]
        } else {
          resultMessage = `添加分类成功`
          this.ruleValidate.name = [
            {required: true, message: '分类名不能为空', trigger: 'blur'},
            {type: 'string', min: 1, max: 20, message: '分类名不能小于1位或大于20位', trigger: 'blur'}
          ]
          this.formValidate.link = this.formValidate.name
        }
        this.SubmitLoading = true;
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post('/user/url', this.formValidate).then(({data}) => {
              this.SubmitLoading = false
              if (data.code == $HTTP.SUCCESS) {
                this.formModal = false
                this.cancel()
                this.load()
                this.$Notice.success({
                  title: '成功提示',
                  desc: resultMessage
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
      updateUrl(name) {
        this.SubmitLoading = true;
        this.$refs[name].validate((valid) => {
          if (valid) {
            let resultMessage
            if (this.formValidate.parentId) {
              resultMessage = '修改链接成功'
            } else {
              resultMessage = '修改分类成功'
            }
            this.$http.put('/user/url', this.formValidate).then(({data}) => {
              this.SubmitLoading = false
              if (data.code == $HTTP.SUCCESS) {
                this.formModal = false
                this.cancel()
                this.load()
                this.$Notice.success({
                  title: '成功提示',
                  desc: resultMessage
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
        this.modalName = '增加链接'
        this.formValidate.parentId = id
        this.formModal = true
      },
      updateById(id) {
        this.isUpdate = true
        this.$http.get(`/user/url?id=${id}`).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.formModal = true
            this.formValidate = data.data
            let result = this.formValidate.link.split(":")
            if (this.formValidate.parentId) {
              this.formValidate.method = result[0]
              this.formValidate.link = result[1]
              this.modalName = '修改链接'
            } else {
              this.formValidate.method = 'GET'
              this.modalName = '修改分类'
            }
          }
        })
      },
      deleteById(id, cl, index) {
        if (cl > 0) {
          this.$Notice.error({
            title: '警告提示',
            desc: `请先删除分类下的链接`
          })
        } else {
          let message, resultMessage
          if (index < 2) {
            message = '确认删除此分类吗？'
            resultMessage = '删除分类成功'
          } else {
            message = '确认删除此链接吗？'
            resultMessage = '删除链接成功'
          }
          this.$Modal.confirm({
            title: '确认提示',
            content: message,
            loading: true,
            onOk: () => {
              this.$http.delete(`/user/url?id=${id}`).then(({data}) => {
                if (data.code == $HTTP.SUCCESS) {
                  this.$Modal.remove()
                  this.load()
                  this.$Notice.success({
                    title: '成功提示',
                    desc: resultMessage
                  })
                }
              })
            }
          })
        }
      },
      updateIsActive(ids, isActive, index) {
        let message
        if (DList.Attribute.YES == isActive) {
          if (index < 2) {
            message = '启用分类成功'
          } else {
            message = '启用链接成功'
          }
        } else {
          if (index < 2) {
            message = '禁用分类成功'
          } else {
            message = '禁用链接成功'
          }
        }
        this.$http.put(`/user/url/updateIsActive?isActive=${isActive}`, ids).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.$Modal.remove()
            this.load()
            this.$Notice.success({
              title: '成功提示',
              desc: message
            })
          }
        })
      },
      updateIsActiveById(id, isActive, index) {
        let ids = [id]
        let message
        if (DList.Attribute.YES == isActive) {
          if (index < 2) {
            message = '确认要启用此分类吗？'
          } else {
            message = '确认要启用链接吗？'
          }
        } else {
          if (index < 2) {
            message = '确认要禁用此分类吗？禁用后，子链接也无法访问'
          } else {
            message = '确认要禁用链接吗？'
          }
        }
        this.$Modal.confirm({
          title: '确认提示',
          content: message,
          loading: true,
          onOk: () => {
            this.updateIsActive(ids, isActive, index)
          }
        })
      }
    }
  }
</script>
