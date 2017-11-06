<template>
  <!-- 工程师详情 -->
  <div class="module-engineer-action">
    <div class="tablePanel">
      <div class="ivu-title flex mb-10">
        <div class="ivu-title-name f-18"><Icon type="navicon" class="mr-10"></Icon>工程师信息</div>
        <!-- <div class="ivu-title-button ml-10"><Button type="ghost" class="ivu-btn-default" @click="routerBack">关闭</Button></div> -->
        <!-- <div class="ivu-title-button ml-10"><Button type="ghost" class="ivu-btn-default">编辑</Button></div> -->
      </div>
      <div class="ivu-information-box clearfix">
        <div class="ivu-information-box-img f-l"><img :src="picSrc.head" alt="">

        </div>
        <div class="ivu-information-box-text f-l ml-30 f-14 clearfix">
            <ul class="ta-r f-l">
              <li>状态：</li>
              <li>姓名：</li>
              <li>手机号：</li>
              <li>员工号：</li>
              <li>服务星级：</li>
            </ul>
            <ul class="ta-l f-l">
              <li class="color-ligth-blue">{{ baseInfo.statusName || '--' }}</li>
              <li>{{ baseInfo.name || '--' }}</li>
              <li>{{ baseInfo.mobile || '--' }}</li>
              <li>{{ baseInfo.accountCode || '--' }}</li>
              <li>{{ baseInfo.serviceLevel + '' || '--' }}</li>
            </ul>
        </div>
        <div class="ivu-information-box-text f-l ml-30 f-14 clearfix">
            <ul class="ta-r f-l">
              <li>性别：</li>
              <li>出生日期：</li>
              <li>年龄：</li>
              <li>创建日期：</li>
              <li>更新日期：</li>
            </ul>
            <ul class="ta-l f-l">
              <li>{{ [0, 1].includes(baseInfo.sex)
                     ? (baseInfo.sex ? '男' : '女')
                     : '--' }}</li>
              <li>{{ baseInfo.birthday || '--' }}</li>
              <li>{{ setAge(baseInfo.birthday) || '--' }}</li>
              <li>{{ baseInfo.createTime || '--' }}</li>
              <li>{{ baseInfo.updateTime || '--' }}</li>
            </ul>
        </div>
      </div>
      <Tabs type="card" value="other" class="mt-20">
          <TabPane label="其他个人信息" name="other">
            <div class="ivu-tabs-text f-14 p-20">
              <div class="w-sty1 clearfix">
                <div class="ta-l f-l w-sty1-color1">学历：</div>
                <div class="ta-l f-l w-sty1-color2">{{ analyseEducation(tabs.other.education) || '--' }}</div>
              </div>
              <div class="w-sty1 clearfix">
                <div class="ta-r f-l w-sty1-color1">固定电话：</div>
                <div class="ta-l f-l w-sty1-color2">{{ tabs.other.telephone || '--' }}</div>
              </div>
              <div class="w-sty1 clearfix">
                <div class="ta-l f-l w-sty1-color1">邮箱：</div>
                <div class="ta-l f-l w-sty1-color2">{{ tabs.other.email || '--' }}</div>
              </div>
              <div class="w-sty1 clearfix">
                <div class="ta-l f-l w-sty1-color1">其他电话：</div>
                <div class="ta-l f-l w-sty1-color2">{{ tabs.other.otherPhone || '--' }}</div>
              </div>
              <div class="w-sty1 clearfix">
                <div class="ta-l f-l w-sty1-color1">通讯地址：</div>
                <div class="ta-l f-l w-sty1-color2">{{ tabs.other.postalAddress || '--' }}</div>
              </div>
            </div>
          </TabPane>
          <TabPane label="证件信息" name="document">
            <div class="ivu-tabs-text f-14 p-20">
              <div class="w-sty1 clearfix">
                <div class="ta-l f-l w-sty1-color1">证件类型：</div>
                <div class="ta-l f-l w-sty1-color2">
                  <!-- {{ certificateType }} -->
                  身份证
                </div>
              </div>
              <div class="w-sty1 clearfix">
                <div class="ta-l f-l w-sty1-color1">身份证号：</div>
                <div class="ta-l f-l w-sty1-color2">{{ tabs.document.idCardNo || '--' }}</div>
              </div>
              <div class="w-sty1 clearfix">
                <div class="ta-l f-l w-sty1-color1">民族：</div>
                <div class="ta-l f-l w-sty1-color2">{{ tabs.document.nation || '--' }}</div>
              </div>
              <div class="w-sty1 clearfix">
                <div class="ta-l f-l w-sty1-color1">发证机关：</div>
                <div class="ta-l f-l w-sty1-color2">{{ tabs.document.issuingAuthority || '--' }}</div>
              </div>
              <div class="w-sty1 clearfix">
                <div class="ta-l f-l w-sty1-color1">有效期：</div>
                <div class="ta-l f-l w-sty1-color2">{{ tabs.document.endDate || '--' }}</div>
              </div>
              <div class="w-sty1 clearfix">
                <div class="ta-l f-l w-sty1-color1">居住地址：</div>
                <div class="ta-l f-l w-sty1-color2">{{ tabs.document.liveAddress || '--' }}</div>
              </div>
              <div class="flex w-sty2 pt-10 pb-10">
                <p class="align-self-start">证件照片：</p>
                <!-- todo -->
                <img @click="showBigImg" :src="picSrc.idCardFront" alt="" srcset="" class="ml-10">
                <img @click="showBigImg" :src="picSrc.idCardBack" alt="" srcset="" class="ml-10">
              </div>
            </div>
          </TabPane>
          <TabPane label="资质证书" name="certificate">
            <Table stripe :data="tabs.certificate.data" :columns="tabs.certificate.columns"></Table>
          </TabPane>
          <TabPane label="技能信息" name="skills">
            <Table stripe :data="tabs.skills.data" :columns="tabs.skills.columns"></Table>
            </TabPane>
          <TabPane label="获奖证书" name="award">
            <Table stripe :data="tabs.award.data" :columns="tabs.award.columns"></Table>
          </TabPane>
          <TabPane label="结算账户信息" name="account">
            <div class="f-14 pl-20 pr-20 pb-20">
              微信结算账户：XXXXX  显示最近30天内交易记录
              <button type="button" class="ivu-btn-default ivu-btn ml-10">查看全部</button>
            </div>
            <Table stripe :data="tabs.account.data" :columns="tabs.account.columns"></Table>
          </TabPane>
          <TabPane label="培训记录" name="train">
            <div class="f-14 pl-20 pr-20 pb-20">
              显示最近180天内培训记录
              <button type="button" class="ivu-btn-default ivu-btn ml-10">查看全部</button>
            </div>
            <Table stripe :data="tabs.train.data" :columns="tabs.train.columns"></Table>
          </TabPane>
          <TabPane label="信用记录" name="credit">
            <div class="f-14 pl-20 pr-20 pb-20">
              当前x信用分：120  显示最近30天内交易记录
              <button type="button" class="ivu-btn-default ivu-btn ml-10">查看全部</button>
            </div>
            <Table stripe :data="tabs.credit.data" :columns="tabs.credit.columns"></Table>
          </TabPane>
          <TabPane label="状态变更记录" name="statusChange">
            <Table stripe :data="tabs.statusChange.data" :columns="tabs.statusChange.columns"></Table>
          </TabPane>
      </Tabs>
    </div>
    <Modal v-model="bigImgModal.show"
           :title="bigImgModal.title"
           @on-cancel="resetPicSrc"
           :mask-closable="false">
      <img :src="bigImgModal.src"></img>
      <div slot="footer">
        <Button @click="resetPicSrc">确定
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import defaultHeadPic from '@/assets/img_bg.png'
  /* 变量名简写说明E: Engineer */
  export default {
    name: 'EngineerInfo',
    data() {
      return {
        Eid: null,
        CONST: {
          education: {
            'PRIMARY': '小学',
            'MIDDLE': '初中',
            'HIGH': '高中',
            'UNIVERSITY': '本科',
            'SECONDARY': '中专',
            'COLLEGE': '大专',
            'MASTER': '硕士',
            'DOCTOR': '博士'
          },
          levelList: ['0', '1', '2', '3', '4', '5']
        },
        bigImgModal: {
          show: false,
          src: defaultHeadPic,
          title: '证书照片大图'
        },
        picSrc: {
          head: defaultHeadPic,
          idCardFront: defaultHeadPic,
          idCardBack: defaultHeadPic
        },
        /* 基本信息：于头像右侧 */
        baseInfo: {
          statusName: null,
          name: null,
          mobile: null,
          accountCode: null,
          serviceLevel: null,
          sex: null,
          birthday: null,
          age: null,
          createTime: null,
          updateTime: null,
          headPic: null
        },
        tabs: {
          /* 其他个人信息 */
          other: {
            education: null,
            telephone: null,
            email: null,
            otherPhone: null,
            postalAddress: null
          },
          /* 证件信息 */
          document: {
            idCardNo: null,
            nation: null,
            issuingAuthority: null,
            endDate: null,
            liveAddress: null,
            idCardFront: null,
            idCardBack: null
          },
          /* 资质证书 engineerQualifications */
          certificate: {
            data: [],
            columns: [
              {
                  type: 'index',
                  width: 60,
                  align: 'center',
                  title: "编号"
              },
              {
                title: '资质类型',
                key: 'typeName',
                render (h, params) {
                  let type = params.row.type
                  let typeName = params.row.typeName
                  let name = params.row.name
                  return h('span', {}, type === 'other' ? (typeName + '(' + name + ')') : typeName)
                }
              },
              {
                title: '证书编号',
                key: 'no'
              },
              {
                title: '审核状态',
                key: 'auditStatusName'
              },
              {
                title: '审核日期',
                key: 'auditTime'
              },
              {
                title: '审核说明',
                key: 'auditDesc'
              },
              {
                title: '更新时间',
                key: 'updateTime',
                render (h, params) {
                  let updateTime = params.row.updateTime
                  let createTime = params.row.createTime
                  return h('span', {}, updateTime === null ? createTime : updateTime)
                }
              },
              {
                title: '有效期',
                key: 'isLongTerm',
                render (h, params) {
                  let isLongTerm = params.row.isLongTerm
                  let endTime = params.row.endTime || ''
                  return h('div', {
                    style: {
                      // textAlign: 'center'
                    }
                  }, [
                    h('div', {}, isLongTerm === 1 ? '长期' : ''),
                    h('div', {}, isLongTerm === 1 ? '(无到期时间)' : endTime)
                  ])
                }
              }
            ]
          },
          /* 技能信息 */
          skills: {
            data: [],
            columns: [
              {
                  type: 'index',
                  width: 60,
                  align: 'center',
                  title: "编号"
              },
              {
                title: '产品类型',
                key: 'productCategoryName'
              },
              {
                title: '品牌',
                key: 'productBrandName'
              },
              {
                title: '技能类型',
                key: 'typeName'
              },
              {
                title: '来源',
                key: 'srcChannelName'
              },
              {
                title: '更新日期',
                key: 'updateTime',
                render (h, params) {
                  let updateTime = params.row.updateTime
                  let createTime = params.row.createTime
                  return h('span', {}, updateTime === null ? createTime : updateTime)
                }
              },
              {
                title: '有效期',
                key: 'isLongTerm',
                render (h, params) {
                  let isLongTerm = params.row.isLongTerm
                  let endTime = params.row.endTime || ''
                  return h('div', {
                    style: {
                      // textAlign: 'center'
                    }
                  }, [
                    h('div', {}, isLongTerm === 1 ? '长期' : ''),
                    h('div', {}, isLongTerm === 1 ? '(无到期时间)' : endTime)
                  ])
                }
              }
            ]
          },
          /* 获奖证书 */
          award: {
            data: [],
            columns: [
              {
                  type: 'index',
                  width: 60,
                  align: 'center',
                  title: "编号"
              },
              {
                title: '获奖证书类型',
                key: 'typeName',
                render (h, params) {
                  let type = params.row.type
                  let typeName = params.row.typeName
                  let name = params.row.name
                  return h('span', {}, type === 'other' ? (typeName + '(' + name + ')') : typeName)
                }
              },
              {
                title: '更新日期',
                key: 'updateTime',
                render (h, params) {
                  let updateTime = params.row.updateTime
                  let createTime = params.row.createTime
                  return h('span', {}, updateTime === null ? createTime : updateTime)
                }
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
                        size: 'small',
                        value: ''
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: (e) => {
                          /* 弹出大图 */
                          let id = row.certificatePic
                          this.showCertificationPic(id)
                        }
                      }
                    }, '查看证书照片')
                  ]);
                }
              }
            ]
          },
          /* 结算账户信息 */
          account: {
            data: [],
            columns: [
              {
                title: '编号',
                key: 'xx'
              },
              {
                title: '交易类型',
                key: 'xx'
              },
              {
                title: '交易流水号 ',
                key: 'xx'
              },
              {
                title: '交易金额',
                key: 'xx'
              },
              {
                title: '交易时间',
                key: 'xx'
              },
              {
                title: '交易状态',
                key: 'xx'
              },
              {
                title: '交易参考编号',
                key: 'xx'
              }
            ]
          },
          /* 培训记录 */
          train: {
            data: [],
            columns: [
              {
                title: '编号',
                key: 'xx'
              },
              {
                title: '类型',
                key: 'xx'
              },
              {
                title: '内容 ',
                key: 'xx'
              },
              {
                title: '结果',
                key: 'xx'
              },
              {
                title: '参加时间',
                key: 'xx'
              }
            ]
          },
          /* 信用记录 */
          credit: {
            data: [],
            columns: [
              {
                title: '编号',
                key: 'xx'
              },
              {
                title: '信用分',
                key: 'xx'
              },
              {
                title: '参考号',
                key: 'xx'
              },
              {
                title: '时间',
                key: 'xx'
              }
            ]
          },
          /* 状态变更记录 */
          statusChange: {
            data: [],
            columns: [
              {
                type: 'index',
                width: 60,
                align: 'center',
                title: "编号"
              },
              {
                title: '事件',
                key: 'eventName'
              },
              {
                title: '操作人',
                key: 'triggeredBy'
              },
              {
                title: '操作时间',
                key: 'eventDate'
              },
              {
                title: '说明',
                key: 'comment'
              }
            ]
          }
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      let Eid = to.query.Eid
      console.log(Eid)
      /* 下面方法在mounted后执行 */
      next((vm) => {
        vm.Eid = Eid
        vm.getEInfo()
      })
    },
    // 钩子(创建执行)
    created() {
    },
    mounted () {
    },
    computed: {
      visitedViews () {
        let views = this.$store.state.views.visitedViews
          .slice(/* -this.size */)
          .filter((item) => {
            return item.meta.isTabView // 排除首页
          })
        this.$store.dispatch('setTabsView', views)
        return views
      }
    },
    // 方法
    methods: {
      /* 返回上一个视图 */
      routerBack() {
        // window.close()
        this.$router.go(-1)
        let view = this.visitedViews.filter((view) => {
          return this.$route.name === view.name
        })[0]
        this.$store.dispatch('delVisitedViews', view).then((views) => {
          if (this.isActive(view.path)) {
            const latestView = views.slice(-1)[0]
            if (latestView) {
              this.$router.push(latestView.path)
            } else {
              this.$router.push('/')
              common.sendEvent('link-change', ['首页'])
            }
          }
        })
      },
      getEInfo () {
        let Eid = this.Eid
        let url = `/user/engineer/findEngineerById`
        let params = `?id=${Eid}`
        this.$http.get(url + params).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            let cdata = data.data
            console.log(cdata, 1111)
            /* 解析数据 */
            cdata.birthday ?
            cdata.birthday = common.formatDate(new Date(cdata.birthday)) : ''// 格式化时间
            this.analyseGettedEInfo(cdata)
          }
        })
      },
      analyseGettedEInfo (data) {
        let _base = this.baseInfo
        let _other = this.tabs.other
        let _document = this.tabs.document
        let _certificate = this.tabs.certificate.data
        let _award = this.tabs.award.data
        let _skills = this.tabs.skills.data
        common.copyObj(_base, data)
        _base.accountCode = data.user.accountCode;
        _base.mobile = data.user.mobile
        _other.telephone = data.phone
        // 工程师头像 这里大概率要改
        _base.headPic = data.user.headPic

        common.copyObj(_other, data)

        common.copyObj(_document, data)

        this.tabs.certificate.data = data.engineerQualifications

        this.tabs.award.data = data.engineerAwardCertificates

        this.tabs.skills.data = data.engineerSkills

        this.tabs.statusChange.data = data.engineerEvent

        console.log(_base, this.tabs)
        let headId = _base.headPic
        let idCardBackId = this.tabs.document.idCardBack
        let idCardFrontId = this.tabs.document.idCardFront
        let head = 'head'
        let idCardBack = 'idCardBack'
        let idCardFront = 'idCardFront'
        this.getPicById([
          { id: headId, target: head },
          { id: idCardBackId, target: idCardBack },
          { id: idCardFrontId, target: idCardFront }
        ])
        console.log(this.tabs, data)
      },
      getPicById (objPics) {
        console.log(objPics, 223)
        for (let objPic of objPics) {
          if (!objPic.id) {
            // objPic.target = defaultHeadPic
          } else {
            let url = `/document/document/getDocumentByID`
            let params = `?documentID=${objPic.id}`
            this.$http.get(url + params).then(({data}) => {
              if (data.code == $HTTP.SUCCESS) {
                let cdata = data.data.Document
                /* 解析数据 */
                this.picSrc[objPic.target] = cdata.accessUrl
              }
            })
          }
        }
        console.log(objPics, this.picSrc)
      },
      analyseEducation (code) {
        let res
        Object.keys(this.CONST.education).forEach((key) => {
          if (key === code) {
            res =  this.CONST.education[key]
          }
        })
        return res
      },
      analyseServiceLevel (level) {
        return this.CONST.levelList[level] || '无星级'
      },
      setAge (strBirthday) {
        let res = common.computeAge(strBirthday)
        return res
      },
      resetPicSrc () {
        this.bigImgModal.show = false
        /* 延迟200ms重置图片src */
        setTimeout(() => {
          this.bigImgModal.src = defaultHeadPic
        }, 200)
      },
      /**
       * 展示大图
       * @param param 可能值为src或是window.event
       */
      showBigImg (param) {
        this.bigImgModal.show = true
        if (typeof param === 'string') {
          this.bigImgModal.src = param
        } else {
          let src = param.target.currentSrc
          this.bigImgModal.src = src
        }
      },
      showCertificationPic (id) {
        let url = `/document/document/getDocumentByID`
        let params = `?documentID=${id}`
        this.$http.get(url + params).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            let cdata = data.data.Document
            /* 解析数据 */
            let src = cdata.accessUrl
            this.showBigImg(src)
          }
        })
      }
    }
  }
</script>
