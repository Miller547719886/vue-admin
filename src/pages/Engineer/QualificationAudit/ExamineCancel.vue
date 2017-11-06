<template>
  <!-- 弹窗-取消资质审核结果 -->
  <div class="module-engineer-ExaminePopup">
    <modal v-model="modalShow" width="800px">
      <p slot="header" style="text-align:center">
        <span>取消资质审核结果</span>
      </p>
      <Tabs type="card">
        <TabPane label="工程师信息">
          <div class="engineerInfobox">
            <div class="engineerInfoLeft">
              <p>
                <span>工程师姓名：</span>
                <span>{{ engineerData.engineerName || '无' }}</span>
              </p>
              <p>
                <span>工号：</span>
                <span>{{ engineerData.accountCode || '无' }}</span>
              </p>
              <p>
                <span>工程师电话：</span>
                <span>{{ engineerData.mobile || '无' }}</span>
              </p>
            </div>
            <div class="engineerInfoLeft">
              <p>
                <span>身份证号：</span>
                <span>{{ engineerData.idCardNo || '无' }}</span>
              </p>
              <p>
                <span>所属服务商：</span>
                <span>{{ engineerData.auditOrgName || '无' }}</span>
              </p>
              <p>
                <span>服务商电话：</span>
                <span>{{ engineerData.telephone || '无' }}</span>
              </p>
            </div>
          </div>
        </TabPane>
      </Tabs>
      <Tabs type="card">
        <TabPane label="资质证书信息">
          <div class="engineerInfobox">
            <div class="engineerInfoLeft">
              <p>
                <span>资质类型名称：</span>
                <span>{{ engineerData.typeName || '无' }}</span>
              </p>
              <a v-bind:href="engineerData.checkUrl || 'javascript:;'">
                点击前往证书查询网站
              </a>
            </div>
            <div class="engineerInfoLeft">
              <p>
                <span>证件编号：</span>
                <span>{{ engineerData.no || '无' }}</span>
              </p>
            </div>
          </div>
        </TabPane>
      </Tabs>
      <Tabs  type="card">
        <TabPane style="width:100%;overflow:hidden;" class="Explaininfo" label="审核结果">
          <div style="display: inline-block;width:49%;">
            审核结果：审核不通过
          </div>
          <div class="mt-10 starFlag">
            审核说明：
            <Input style="width:80%;vertical-align:top" type="textarea" :maxlength="100" v-model="formValidate.auditDesc" placeholder="请输入审核说明">
            </Input>
          </div>
        </TabPane>
      </Tabs>
      <div slot="footer">
        <Button @click="submitCancelCertification">提交
        </Button>
      </div>
    </modal>
  </div>
</template>
<script>
  export default {
    name: 'ExamineCancel',
    props: {
      value: {
        type: Boolean,
        require: true,
        default: false
      },
      title: {
        type: String,
        require: true,
        default: '默认标题'
      },
      engineerId: {
        require: true,
        default: ''
      },
      dataId: {
        require: true,
        default: ''
      }
    },
    data () {
      return {
        selectStatus: '',
        selectValidDate: '',
        selectList: [
          {
            value: 'yes',
            label: '通过审核',
            status: 'WAITTING'
          },
          {
            value: 'no',
            label: '审核不通过',
            status: 'NEW'
          }
        ],
        engineerData: {
          // 工程师信息
          engineerName: '',
          auditOrgName: '',
          accountCode: '',
          telephone: '',
          telephone: '',
          idCardNo: '',
          typeName: '',
          checkUrl: '',
          name: '',
          no: ''
        },
        initialFormValidate: {
          qualificationId: '',
          auditDesc: '',
        },
        formValidate: {
          qualificationId: '',
          auditDesc: '',
        },
        value6: ''
      }
    },

    // 方法
    methods: {
      getEngineerInfo (engineerId, dataId) {
        let url = '/user/engineer/findEngineerById?id=' + engineerId
        this.$http.get(url).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            let dataIndex = ''
            let info = data.data.engineerQualifications
            // 根据id回选所在数组
            info.forEach((item, index) => {
              if (item.id == dataId) {
                dataIndex = index
              }
            })
            this.engineerData = info[dataIndex]
            // 身份证号
            this.engineerData.idCardNo = data.data.idCardNo
            // 工号
            this.engineerData.accountCode = data.data.accountCode
            // 所属服务商
            this.engineerData.auditOrgName = data.data.organization.name
            // 服务商电话
            this.engineerData.telephone = data.data.organization.telephone
            // 工程师电话
            this.engineerData.mobile = data.data.user.mobile
            // 资质类型名称
            this.engineerData.typeName = this.engineerData.typeName + '(' + data.data.engineerQualifications[dataIndex].name + ')'
          }
        })
      },
      submitCancelCertification () {
        console.log(this.formValidate.auditDesc)
        if (this.formValidate.auditDesc) {
          let url = `/user/engineer/cancelQualificationAudit`
          let params = '?qualificationId=' + this.dataId + '&auditDesc=' + this.formValidate.auditDesc + ''
          this.$http.post(url + params).then(({data}) => {
            // this.SubmitLoading = false
            if (data.code == $HTTP.SUCCESS) {
              this.$Notice.success({
                title: '成功提示',
                desc: `提交审核成功`
              })
              this.modalShow = false
              this.formValidate = JSON.parse(JSON.stringify(this.initialFormValidate))
              this.emitSubmitSuccess()
            }
          })
        } else {
          this.$Notice.warning({
            title: '警告提示',
            desc: `请填写审核说明`
          })
        }
      },
      emitSubmitSuccess () {
        this.$emit('submit-success', true)
      },
      clearFormValueData () {
        this.formValidate.auditDesc = ''
      },
    },
    model: {
      prop: 'value',
      event: 'input'
    },
    computed: {
      modalShow: {
        get () {
          return this.value
        },
        set (val) {
          this.$emit('input', val)
        }
      }
    },
    watch: {
      modalShow (newVal, oldVal) {
        if (newVal) {
          console.log(this.engineerId)
          this.getEngineerInfo(this.engineerId, this.dataId)
        } else {
          this.clearFormValueData()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
.selectValidDate {
  .ivu-select-dropdown-list {
    height: 90px;
  }
}
.starFlag {
  position: relative;
  &::before {
    content: '*';
    z-index: 999;
    position: absolute;
    top: 50%;
    left: -5px;
    transform: translate(-100%, -145%);
    font-family: SimSun;
    font-size: 12px;
    color: #ed3f14;
  }
}

.Explaininfo {
  padding: 0 0 0 40px;
}
.engineerInfobox {
  padding-left: 40px;
}
.engineerInfoLeft {
  padding-bottom: 10px;
  float: left;
  width: 50%;
}
.engineerInfoLeft p span:first-child{
    text-align: right;
    display: inline-block;
    width: 7em;
  }
.ExplainInput {
  padding-top: 20px;
  overflow: hidden;
  .ExplainInput1 {
    display: inline-block;
    float: left;
  }
  .ExplainInput2 {
    display: inline-block;
    width: 80%;
    float: left;
  }
}
.ivu-modal-footer {
  height: 50px;
  position: relative;
}
.footButton1 {
  text-align: center;
  position: absolute;
  width: 150px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
