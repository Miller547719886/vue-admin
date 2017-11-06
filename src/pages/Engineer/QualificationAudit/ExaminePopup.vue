<template>
  <!-- 弹窗-资质证书审核 -->
  <div class="module-engineer-ExaminePopup">
    <modal v-model="modalShow" width="800px">
      <p slot="header" style="text-align:center">
        <span>资质证书审核</span>
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
          <div class="starFlag isStarFlag" style="display: inline-block;width:30%;">
            <div class="isValidity">审核结果：</div>
            <Select class="isValidity1" @on-change="changeTimeFlag" v-model="ids.auditStatus" :label-in-value="true"	style="width:100px;">
              <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div v-bind:class="isTimeDataFlag ? 'isStarFlag' : 'starFlag isStarFlag'" style="display: inline-block;width:30%;">
            <div class="isValidity">有效期：</div>
            <Row class="isValidity1">
              <Col span="12">
                <DatePicker @on-change="endTime" v-model="ids.endTime" :disabled="isTimeDataFlag" type="date" :options="options3" placeholder="选择日期" style="width: 120px"></DatePicker>
              </Col>
            </Row>
          </div>
          <div  style="width: 30%;">
              <div style="display: inline-block;">是否长期有效：</div>
              <Select v-model="ids.isLongTerm" @on-change="isLongTermSlt" :disabled="disabledFlag" style="width:118px">
                <Option v-for="item in isLongTermList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
          </div>
          <div class="ExplainInput">
            <span class="ExplainInput1">审核说明：</span>
            <Input class="ExplainInput2" v-model="ids.auditDesc" type="textarea" :max="100" :rows="4" placeholder="请输入..."></Input>
          </div>
        </TabPane>
      </Tabs>
      <div slot="footer">
        <Button
                @click="examineSubmit">提交
        </Button>
      </div>
    </modal>
  </div>
</template>
<script>
  export default {
    name: 'ExaminePopup',
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
      // 资质id
      dataId: {
        require: true,
        default: ''
      }
    },
    data () {
      return {
        single: false,
        selectValidDate: '',
        disabledFlag: true,
        isTimeDataFlag: true,
        options3: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        selectList: [
          {
            value: 'PASS',
            label: '审核通过'
          },
          {
            value: 'REJECT',
            label: '审核不通过'
          }
        ],
        isLongTermList: [
          {
            value: 1,
            label: '是'
          },
          {
            value: 2,
            label: '不是'
          }
        ],
        initialEngineerData: {
          // 工程师信息
          endTimeData: '',
          engineerName: '',
          auditOrgName: '',
          accountCode: '',
          telephone: '',
          idCardNo: '',
          typeName: '',
          checkUrl: '',
          name: '',
          no: '',
        },
        engineerData: {
          // 工程师信息
          endTimeData: '',
          engineerName: '',
          auditOrgName: '',
          accountCode: '',
          telephone: '',
          idCardNo: '',
          typeName: '',
          checkUrl: '',
          name: '',
          no: '',
        },
        flag: true,
        userId: '',
        initialIds: {
          isLongTerm: '',
          timeData: '',
          auditStatus: '',
          auditStatusName: '',
          auditDesc: ''
        },
        ids: {
          isLongTerm: '',
          endTime: '',
          auditStatus: '',
          auditStatusName: '',
          auditDesc: ''
        }
      }
    },

    // 方法
    methods: {
      endTime (val) {
       this.ids.endTime = val
      },
      isLongTermSlt (val) {
        if (val == 1) {
          this.isTimeDataFlag = true
          this.ids.endTime = ''
        } else if (this.flag) {
          this.isTimeDataFlag = false
        }
      },
      changeTimeFlag (val) {
        console.log(val, this.ids.auditStatus)
        if (val.value === 'PASS') {
          this.isTimeDataFlag = false
          this.disabledFlag = false
          this.ids.isLongTerm = 2
          this.flag = true
        } else {
          this.isTimeDataFlag = true
          this.disabledFlag = true
          this.flag = false
          this.ids.endTime = ''
          this.ids.isLongTerm = ''
        }
        this.ids.auditStatus = val.value
        this.ids.auditStatusName = val.label
      },
      getEngineerInfo (engineerId, dataId) {
        let url = '/user/engineer/findEngineerById?id=' + engineerId
        this.$http.get(url).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            let dataIndex = ''
            this.userId = data.data.user.id
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
            this.engineerData.accountCode = data.data.user.accountCode
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
      examineSubmit () {
        let userInfo = this.getStorage('USER_KEY')
        this.ids.id = this.dataId
        this.ids.userId = this.userId
        let url = '/user/engineer/saveQualificationAudit' +
                  (userInfo.organizationId ? ('?organizationId=' + userInfo.organizationId) : '')
        // let _date = this.ids.timeData
        // this.ids.organizationId = userInfo.organizationId
        let subData = JSON.parse(JSON.stringify(this.ids))
        if (subData.isLongTerm == 2) {
          delete subData.isLongTerm
        }
        for (let item in subData) {
          if (!subData[item]) {
            delete subData[item]
          }
        }
        //subData.timeData = _date
        // if (!subData.auditDesc) {
        //   this.$Notice.warning({
        //     title: '警告提示',
        //     desc: `请完整填写审核信息`
        //   })
        // } else
        if (!subData.auditStatus) {
          this.$Notice.warning({
            title: '警告提示',
            desc: `请完整填写审核信息`
          })
        } else if (subData.auditStatusName == '审核通过') {
          if (subData.isLongTerm || subData.endTime) {
            // 请求
            this.$http.post(url , subData).then(({data}) => {
              if (data.code == $HTTP.SUCCESS) {
                this.$Notice.success({
                  title: '成功提示',
                  desc: `提交审核成功`
                })
                // 关闭弹窗
                this.modalShow = false
                this.ids = JSON.parse(JSON.stringify(this.initialIds))
                this.engineerData = JSON.parse(JSON.stringify(this.initialEngineerData))
                // 让父组件刷新
                this.emitSubmitSuccess()
              }
            })
          } else {
            this.$Notice.warning({
              title: '警告提示',
              desc: `请完整填写审核信息`
            })
          }
        } else {
          // 请求
          this.$http.post(url, subData).then(({data}) => {
            if (data.code == $HTTP.SUCCESS) {
              this.$Notice.success({
                title: '成功提示',
                desc: `提交审核成功`
              })
              // 关闭弹窗
              this.modalShow = false
              this.ids = JSON.parse(JSON.stringify(this.initialIds))
              this.engineerData = JSON.parse(JSON.stringify(this.initialEngineerData))
              // 让父组件刷新
              this.emitSubmitSuccess()
            }
          })
        }
      },
      emitSubmitSuccess () {
        this.$emit('submit-success', true)
      },
      getStorage (key) {
        let v = localStorage.getItem(key);
        if (!v) {
          return;
        }
        if (v.indexOf('obj-') === 0) {
          v = v.slice(4);
          return JSON.parse(v);
        } else if (v.indexOf('str-') === 0) {
          return v.slice(4);
        }
      },
      clearFormValueData () {
        this.ids.auditStatus = ''
        this.ids.endTime = ''
        this.ids.isLongTerm = ''
        this.ids.auditDesc = ''
      }
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
      modalShow (a, b) {
        if (a) {
          // console.log(this.engineerId)
          this.getEngineerInfo(this.engineerId, this.dataId)
        } else {
          this.clearFormValueData()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
.ivu-tabs {
  overflow: visible!important;
}
.Explaininfo {
  overflow: visible!important;
  display: flex;
  flex-wrap: wrap;
}
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
    transform: translate(-100%, -50%);
    font-family: SimSun;
    font-size: 12px;
    color: #ed3f14;
  }
}

.Explaininfo {
  padding: 0 0 0 40px;
  .isStarFlag {
    padding-bottom: -30px;
    .isValidity {
      padding-right: 5px;
      line-height: 32px;
      float: left;
      .ivu-picker-panel-body {
        z-index: 999;
      }
    }
    .isValidity1 {
      float: left;
    }
  }
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
  width: 100%;
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
