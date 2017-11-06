<template>
  <!-- 新增/编辑工程师-弹窗 -->
  <div class="module-engineer-action">
    <modal v-model="modalShow" :title="title" width="800px">
      <Form ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="80">
        <div class="ivu-information-box clearfix">
          <div class="ivu-information-box-img f-l ta-c">
            <img :src="picSrc.headPic"
                 ref="headPic"
                 alt="" style="width:125px;height:125px">
            <div style="position:relative;margin-top:5px;">
              <input type="file" ref="headPicInput"
                accept="image/jpeg,image/gif"
                @change="uploadPic('headPic', 'headPicInput', fillHeadPicFormValidate)"
                style="opacity:0;
                position:absolute;
                left:50%;
                bottom:0;
                margin-left: -20px;
                width:40px;
                height:24px;
                cursor:pointer"></input>
            </div>
            <Button :loading="uploadLoading" size="small" @click="clickUploadPic">
              <Icon type="ios-reverse-camera"></Icon>
              {{ uploadBtnText }}
            </Button>
          </div>
          <div class="ivu-information-box-text f-l ml-30 f-14 clearfix"
               style="padding: 20px 0">
            <Row>
              <Col span="12">
                <Form-item label="姓名"
                          prop="name">
                  <Input :disabled="nameDisabled" v-model="formValidate.name"
                        placeholder="请输入姓名"
                        :maxlength="10"></Input>
                </Form-item>
              </Col>
              <Col span="12">
                <Form-item label="备注名"
                          prop="remarkName">
                  <Input v-model="formValidate.remarkName"
                        placeholder="请输入备注名"
                        :maxlength="10"></Input>
                </Form-item>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <Form-item label="手机号"
                          prop="telephone">
                  <Input :disabled="isUpdate" v-model="formValidate.telephone"
                          placeholder="手机号"
                          :maxlength="11"></Input>
                </Form-item>
              </Col>
              <!-- <Col span="12">
                <Form-item label="工号"
                          prop="accountCode">
                  <Input v-model="formValidate.accountCode"
                        placeholder="请输入工号"
                        :maxlength="20"></Input>
                </Form-item>
              </Col> -->
            </Row>
          </div>
        </div>

        <Tabs class="mt-20" type="card" v-model="tabValue"
              :style="{'min-height': '500px'}">
          <Tab-pane label="其他个人信息" name="other" icon="">
            <div>
              <Row>
                  <Col span="12">
                    <Form-item label="学历"
                              prop="education">
                      <Select v-model="formValidate.education"
                        @on-change="fillEducationName">
                        <Option :value="CONST.education.NULL.value">
                          {{ CONST.education.NULL.label }}
                        </Option>
                        <Option :value="CONST.education.DOCTOR.value">
                          {{ CONST.education.DOCTOR.label }}
                        </Option>
                        <Option :value="CONST.education.MASTER.value">
                          {{ CONST.education.MASTER.label }}
                        </Option>
                        <Option :value="CONST.education.UNIVERSITY.value">
                          {{ CONST.education.UNIVERSITY.label }}
                        </Option>
                        <Option :value="CONST.education.COLLEGE.value">
                          {{ CONST.education.COLLEGE.label }}
                        </Option>
                        <Option :value="CONST.education.SECONDARY.value">
                          {{ CONST.education.SECONDARY.label }}
                        </Option>
                        <Option :value="CONST.education.HIGH.value">
                          {{ CONST.education.HIGH.label }}
                        </Option>
                        <Option :value="CONST.education.MIDDLE.value">
                          {{ CONST.education.MIDDLE.label }}
                        </Option>
                        <Option :value="CONST.education.PRIMARY.value">
                          {{ CONST.education.PRIMARY.label }}
                        </Option>
                      </Select>
                    </Form-item>
                  </Col>
                  <Col span="12">
                    <Form-item label="固定电话"
                              prop="phone">
                      <Input v-model="formValidate.phone"
                            placeholder="请输入固定电话"
                            :maxlength="12"></Input>
                    </Form-item>
                  </Col>
              </Row>
              <Row>
                  <Col span="12">
                    <Form-item label="邮箱"
                              prop="email">
                      <Input v-model="formValidate.email"
                            placeholder="请输入邮箱"
                            :maxlength="20"></Input>
                    </Form-item>
                  </Col>
                  <Col span="12">
                    <Form-item label="其他电话"
                              prop="otherPhone">
                      <Input v-model="formValidate.otherPhone"
                            placeholder="请输入其他电话"
                            :maxlength="12"></Input>
                    </Form-item>
                  </Col>
              </Row>
            </div>

            <div class="postal-address color-light-blue">通讯地址</div>

            <div>
              <Row>
                  <Col span="12">
                    <Form-item label="省"
                              prop="provinceCode">
                      <Select ref="province" :label="formValidate.province" v-model="formValidate.provinceCode"
                        @click.native="setEShowBackFalse"
                        @on-change="getCityByProvinceId(formValidate.provinceCode)">
                        <Option v-for="item in address.province" :value="item.provinceCode" :key="item.provinceCode">
                          {{ item.provinceName }}
                        </Option>
                      </Select>
                    </Form-item>
                  </Col>
                  <Col span="12">
                    <Form-item label="市"
                              prop="cityCode">
                      <Select ref="city" :label="formValidate.city" v-model="formValidate.cityCode"
                        @click.native="setEShowBackFalse"
                        @on-change="getDistrictByCityId(formValidate.cityCode)">
                        <Option v-for="item in address.city" :value="item.cityCode" :key="item.cityCode">
                          {{ item.cityName }}
                        </Option>
                      </Select>
                    </Form-item>
                  </Col>
              </Row>
              <Row>
                  <Col span="12">
                    <Form-item label="区/县"
                              prop="districtCode">
                      <Select ref="district" :label="formValidate.district" v-model="formValidate.districtCode"
                        @click.native="setEShowBackFalse"
                        @on-change="getStreetByDistrictId(formValidate.districtCode)">
                        <Option v-for="item in address.district" :value="item.districtCode" :key="item.districtCode">
                          {{ item.districtName }}
                        </Option>
                      </Select>
                    </Form-item>
                  </Col>
                  <Col span="12">
                    <Form-item label="街道/乡镇"
                              prop="streetCode">
                      <Select ref="street" :label="formValidate.street"
                        @click.native="setEShowBackFalse" v-model="formValidate.streetCode">
                        <Option v-for="item in address.street" :value="item.streetCode" :key="item.streetCode">
                          {{ item.streetName }}
                        </Option>
                      </Select>
                    </Form-item>
                  </Col>
              </Row>
              <Row>
                <Form-item label="详细地址"
                          prop="detailedAddress"
                          >
                  <Input type="textarea" :maxlength="50" v-model="formValidate.detailedAddress">
                  </Input>
                </Form-item>
              </Row>
            </div>
          </Tab-pane>
          <Tab-pane label="资质证书" name="qualification" icon="">
            <div class="mb-10 d-ib">
              <Button icon="android-add"
                      @click="showQualificationModal" class="ivu-btn-default">添加资质证书
              </Button>
              <Button v-if="isUpdate" icon="android-refresh"
                      @click="refresh(CONST.type.qualification)" class="ivu-btn-default">刷新
              </Button>
            </div>
            <div class="spin-outer">
              <Table stripe
                :columns="tabs.qualification.columns"
                :data="tabs.qualification.data" no-data-text="暂无技能信息，点击添加">
              </Table>
              <!-- 分页 -->
              <!-- <div class="clearfix">
                <Page :total="tabs.qualification.total"
                  :page-size="tabs.qualification.size"
                  show-elevator
                  show-sizer
                  show-total
                  @on-change="pageChangeQualification"
                  @on-page-size-change="pageSizeChangeQualification"></Page>
              </div> -->
              <Spin size="large"
                    fix
                    v-if="tabs.qualification.spin"
                    class="login_loading_spin">
                <Icon type="load-c"
                      size="18"
                      class="login-spin-icon-load"></Icon>
                <div>加载中...</div>
              </Spin>
            </div>
          </Tab-pane>
          <Tab-pane label="获奖证书" name="award" icon="">
            <div class="mb-10 d-ib">
              <Button icon="android-add"
                      @click="showAwardModalForAdd" class="ivu-btn-default">添加获奖证书
              </Button>
              <Button v-if="isUpdate" icon="android-refresh"
                      @click="refresh(CONST.type.award)" class="ivu-btn-default">刷新
              </Button>
            </div>
            <div class="spin-outer">
              <Table stripe
                :columns="tabs.award.columns"
                :data="tabs.award.data" no-data-text="暂无获奖信息，点击添加">
              </Table>
              <!-- 分页 -->
              <!-- <div class="clearfix">
                <Page :total="tabs.award.total"
                  :page-size="tabs.award.size"
                  show-elevator
                  show-sizer
                  show-total
                  @on-change="pageChangeAward"
                  @on-page-size-change="pageSizeChangeAward"></Page>
              </div> -->
              <Spin size="large"
                    fix
                    v-if="tabs.award.spin"
                    class="login_loading_spin">
                <Icon type="load-c"
                      size="18"
                      class="login-spin-icon-load"></Icon>
                <div>加载中...</div>
              </Spin>
            </div>
          </Tab-pane>
          <Tab-pane label="技能信息" name="skill">
            <div class="mb-10 d-ib">
              <Button icon="android-add"
                      @click="showSkillModalForAdd" class="ivu-btn-default">添加技能信息
              </Button>
              <Button v-if="isUpdate" icon="android-refresh"
                      @click="refresh(CONST.type.skill)" class="ivu-btn-default">刷新
              </Button>
            </div>
            <div class="spin-outer">
              <Table stripe
                :columns="tabs.skill.columns"
                :data="tabs.skill.data" no-data-text="暂无获奖信息，点击添加">
              </Table>
              <!-- 分页 -->
              <!-- <div class="clearfix">
                <Page :total="tabs.award.total"
                  :page-size="tabs.award.size"
                  show-elevator
                  show-sizer
                  show-total
                  @on-change="pageChangeAward"
                  @on-page-size-change="pageSizeChangeAward"></Page>
              </div> -->
              <Spin size="large"
                    fix
                    v-if="tabs.skill.spin"
                    class="login_loading_spin">
                <Icon type="load-c"
                      size="18"
                      class="login-spin-icon-load"></Icon>
                <div>加载中...</div>
              </Spin>
            </div>
          </Tab-pane>
        </Tabs>
      </Form>
      <div slot="footer">
        <Button v-if="isUpdate"
                :loading="SubmitLoading"
                @click="updateEngineer('formValidate')">提交
        </Button>
        <Button v-else
                :loading="SubmitLoading"
                @click="addEngineer('formValidate')">提交
        </Button>
      </div>
    </modal>
    <!-- 添加资质证书 -->
    <modal :mask-closable="false" @on-cancel="resetFormQualification('formValidateQualification')" v-model="tabs.qualification.modal.show" :title="qualificationTitle">
      <Form ref="formValidateQualification"
            :model="formValidateQualification"
            :rules="ruleValidateQualification"
            :label-width="80">
        <Form-item label="资质类型" prop="type">
          <Select v-model="formValidateQualification.type"
            @on-change="fillTypeNameByCode(formValidateQualification.type, 'qualification')">
            <Option v-for="(item, index) in CONST.qualification" :value="item.code" :key="item.code">
              {{ item.description }}
            </Option>
          </Select>
        </Form-item>
        <Form-item v-if="formValidateQualification.type === 'other'" label="资质名称" prop="name">
          <Input v-model="formValidateQualification.name"
                placeholder="请输入证书名称"
                v-number-letter-chinese-symbol-only
                :maxlength="50"></Input>
        </Form-item>
        <Form-item label="证书编号" prop="no">
          <Input v-model="formValidateQualification.no"
                placeholder="请输入证书编号"
                :maxlength="50"></Input>
        </Form-item>
        <div class="color-red" style="margin-left:20px">请确认证书所有人的姓名、身份证号与此工程师一致，否则无法通过审核。</div>
      </Form>
      <div slot="footer">
        <Button :loading="SubmitLoading"
                @click="isUpdate
                  ? addQualification('formValidateQualification')
                  : _addQualification('formValidateQualification')"> 添加资质证书
        </Button>
      </div>
    </modal>
    <!-- 添加获奖证书 -->
    <modal :mask-closable="false" @on-cancel="resetFormAward('formValidateAward')" v-model="tabs.award.modal.show" :title="awardTitle">
      <Form ref="formValidateAward"
            :model="formValidateAward"
            :rules="ruleValidateAward"
            :label-width="80">
        <Form-item label="获奖证书类型"
                   prop="type">
          <Select v-model="formValidateAward.type"
            @on-change="fillTypeNameByCode(formValidateAward.type, 'award')">
            <Option v-for="(item, index) in CONST.award" :value="item.code" :key="item.code">
              {{ item.description }}
            </Option>
          </Select>
        </Form-item>
        <Form-item v-if="formValidateAward.type === 'other'" label="获奖证书名称" prop="name">
          <Input v-model="formValidateAward.name"
                placeholder="请输入证书名称"
                :maxlength="50"></Input>
        </Form-item>
        <Form-item class="starFlag2" label="证书照片"
                   prop="certificatePic">
          <div class="upload-img clearfix">
            <div class="preview-outer">
              <img :src="picSrc.awardPic" v-show="awardPicisUpdate" ref="awardPic" alt="">
              <div class="preview-mask" v-if="awardPicisUpdate">更改</div>
            </div>
            <div class="uploader" :class="awardPicisUpdate ? 'hide-in-img' : ''">
              <input type="file" ref="awardPicInput"
                     @change="updateUploadAwardPic('awardPic', 'awardPicInput')"
                     style="width: 100%; height: 100%; display: block;">
            </div>
          </div>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button :loading="SubmitLoading"
                @click="isUpdate
                  ? addAward('formValidateAward')
                  : _addAward('formValidateAward')">添加获奖证书
        </Button>
      </div>
    </modal>
    <!-- 添加技能信息 -->
    <modal :mask-closable="false" @on-cancel="resetFormSkill('formValidateSkill')" v-model="tabs.skill.modal.show" :title="skillTitle">
      <Form ref="formValidateSkill" :model="formValidateSkill" :rules="ruleValidateSkill">
        <Form-item>
          <Row >
            <Col class="starFlag1" span="3" style="text-align: right;padding-right:10px">品牌</Col>
            <Col span="9">
              <Form-item
                   prop="productBrand">
                <Select v-model="formValidateSkill.productBrand" style="width:150px" placeholder="请选择" >
                  <Option v-for="item in productBrand" @click.native="getProductType(item.code, item.name)" :value="item.code" :key="item.code">{{ item.name }}</Option>
                </Select>
              </Form-item>
            </Col>
            <Col class="starFlag" span="3" style="text-align: right;padding-right:10px">产品大类</Col>
            <Col span="7">
              <Form-item
                   prop="productCategory">
                <Select v-model="formValidateSkill.productCategory" style="width:150px" placeholder="请选择" >
                  <Option v-for="item in productCategory" @click.native="getProductCategory(item.code, item.name)" :value="item.code" :key="item.code">{{ item.name }}</Option>
                </Select>
              </Form-item>
            </Col>
          </Row>
        </Form-item>
        <Form-item>
          <Row>
            <Col span="3" style="text-align: right;padding-right:10px">产品小类</Col>
            <Col span="9">
              <Form-item>
                <Select v-model="formValidateSkill.productType" style="width:150px" placeholder="请选择">
                  <Option v-for="item in productType" :value="item.code" @click.native="changeProductCategory(item.code, item.name)" :key="item.code">{{ item.name }}</Option>
                </Select>
              </Form-item>
            </Col>
            <Col class="starFlag" span="3" style="text-align: right;padding-right:10px">技能类型</Col>
            <Col span="7">
              <Form-item
                   prop="type">
                <Select v-model="formValidateSkill.type" style="width:150px" placeholder="请选择">
                  <Option v-for="item in type" :value="item.code" @click.native="changeskillType(item.code, item.description)" :key="item.code">{{ item.description }}</Option>
                </Select>
              </Form-item>
            </Col>
          </Row>
        </Form-item>
        <Form-item>
          <Row>
            <Col span="3" style="text-align: right;padding-right:10px">有效期</Col>
            <Col span="9">
              <Form-item
                        prop="isLongTerm">
                <Select v-model="formValidateSkill.isLongTerm" style="width:150px" placeholder="请选择">
                  <Option v-for="item in isLongTerm" @click.native="changeIsLongTerm(item.code, item.name)" :value="item.code" :key="item.code">{{ item.name }}</Option>
                </Select>
              </Form-item>
            </Col>
          </Row>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button :loading="SubmitLoading"
                @click="isUpdate
                  ? addSkill('formValidateSkill')
                  : _addSkill('formValidateSkill')">添加
        </Button>
      </div>
    </modal>
    <!-- 大图 -->
    <Modal v-model="bigImgModal.show"
           :title="bigImgModal.title"
           @on-cancel="resetBigImgSrc"
           :mask-closable="false">
      <img :src="bigImgModal.src"></img>
      <div slot="footer">
        <Button @click="resetBigImgSrc">确定
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import defaultPicSrc from '@/assets/img_bg.png'
  export default {
    name: 'EngineerAction',
    props: {
      value: {
        type: Boolean,
        require: true,
        default: false
      },
      title: {
        type: String,
        require: true,
        default: '新增工程师'
      },
      id: {
        type: [Number, String],
        require: false,
        default: null
      },
      isUpdate: {
        type: Boolean,
        require: true,
        default: false
      },
    },
    // 数据(初始/静态/待填充)
    data () {
      return {
        // title: '新增工程师',
        // 技能 品牌
        productBrand: [
          {
            code: '',
            name: '请选择'
          }
        ],
        // 产品大类
        productCategory: [
          {
            code: '',
            name: '请选择'
          }
        ],
        // 产品小类
        productType: [
          {
            code: '',
            name: '请选择'
          }
        ],
        // 技能类型
        type: [
          {
            code: '',
            description: '请选择'
          }
        ],
        // 有效期
        isLongTerm: [
          {
            code: '',
            name: '请选择'
          },
          {
            code: 1,
            name: '长期 (无到期时间)'
          }
        ],
        model1: 'chongqing',
        tabValue: 'other',
        isUpdateQualification: false,
        isUpdateAward: false,
        awardPicisUpdate: false,
        uploadBtnText: '上传',
        uploadLoading: false,
        awardRowIndex: -1,
        qualificationRowIndex: -1,
        picSrc: {
          headPic: defaultPicSrc,
          awardPic: defaultPicSrc
        },
        bigImgModal: {
          show: false,
          src: defaultPicSrc,
          title: '证书照片大图'
        },
        isFirstGet: {
          province: true,
          city: true,
          district: true,
          street: true
        },
        localAwardPicSrcList: [],
        isFirstOpen: {
          mainModal: true,
          addQualification: true,
          addAward: true
        },
        SubmitLoading: false,
        initialAddress: {
          province: [
            {
              provinceName: '请选择',
              provinceCode: ''
            }
          ],
          city: [
            {
              cityName: '请选择',
              cityCode: ''
            }
          ],
          district: [
            {
              districtName: '请选择',
              districtCode: ''
            }
          ],
          street: [
            {
              streetName: '请选择',
              streetCode: ''
            }
          ]
        },
        address: {
          province: [
            {
              provinceName: '请选择',
              provinceCode: ''
            }
          ],
          city: [
            {
              cityName: '请选择',
              cityCode: ''
            }
          ],
          district: [
            {
              districtName: '请选择',
              districtCode: ''
            }
          ],
          street: [
            {
              streetName: '请选择',
              streetCode: ''
            }
          ]
        },
        CONST: {
          education: {
            PRIMARY: {
              value: 'PRIMARY',
              label: '小学'
            },
            MIDDLE: {
              value: 'JUNIOR',
              label: '初中'
            },
            HIGH: {
              value: 'HIGH',
              label: '高中'
            },
            UNIVERSITY: {
              value: 'UNIVERSITY',
              label: '本科'
            },
            SECONDARY: {
              value: 'SECONDARY',
              label: '中专'
            },
            COLLEGE: {
              value: 'COLLEGE',
              label: '大专'
            },
            MASTER: {
              value: 'MASTER',
              label: '硕士'
            },
            DOCTOR: {
              value: 'DOCTOR',
              label: '博士'
            },
            NULL: {
              value: '',
              label: '请选择'
            }
          },
          type: {
            qualification: 'qualification',
            award: 'award',
            skill: 'skill'
          },
          qualification: [
            {
              description: '请选择',
              code: ''
            }
          ],
          award: [],
          auditStatus: {
            waiting: 'WAITTING',
            pass: 'PASS',
            reject: 'REJECT'
          }
        },
        /* 资质证书表单数据结构 */
        initialFormValidateQualification: {
          "engineerId": null,
          "userId": null,
          "no": "",
          "type": null,
          "typeName": "",
          "name": ""
        },
        formValidateQualification: {
          "engineerId": null,
          "userId": null,
          "no": "",
          "type": null,
          "typeName": "",
          "name": ""
        },
        qualificationTitle: '添加/编辑资质证书',
        ruleValidateQualification: {
          engineerId: [],
          userId: [],
          name: [
            {required: true, message: '必须填写资质名称', trigger: 'change'}
          ],
          type: [
            {required: true, message: '必须选择资质类型', trigger: 'change'},
          ],
          typeName: [],
          no: [
            {required: true, message: '必须填写证书编号', trigger: 'blur'},
          ]
        },
        initialFormValidateAward: {
          "engineerId": null,
          "userId": null,
          "type": null,
          "typeName": "",
          "name": "",
          "certificatePic": null
        },
        /* 获奖证书表单数据结构 */
        formValidateAward: {
          "engineerId": null,
          "userId": null,
          "type": null,
          "typeName": "",
          "name": "",
          "telephone": "",
          "certificatePic": null
        },
        awardTitle: '添加/编辑获奖证书',
        ruleValidateAward: {
          engineerId: [],
          userId: [],
          type: [
            {required: true, message: '必须选择获奖证书类型', trigger: 'change'},
          ],
          name: [
            {required: true, message: '必须填写获奖证书名称', trigger: 'blur'},
          ],
          typeName: [],
          // certificatePic: [
          //   {required: true, message: '至少需要上传一张照片', trigger: 'blur'},
          // ]
        },
        /* 技能信息表单数据结构 */
        formValidateSkill: {
          "id": null,
          "isLongTerm": 1,
          "productBrand": null,
          "productBrandName": null,
          "productCategory": null,
          "productCategoryName": null,
          "productType": null,
          "engineerId": null,
          "productTypeName": null,
          "type": null,
          "typeName": null
        },
        skillTitle: '添加/编辑技能信息',
        ruleValidateSkill: {
          productBrand: [
            {required: true, message: '必须填写品牌', trigger: 'change'}
          ],
          productCategory: [
            {required: true, message: '必须填写产品大类', trigger: 'change'}
          ],
          productType: [

          ],
          type: [
            {required: true, message: '必须填写技能类型', trigger: 'change'}
          ],
          isLongTerm: [

          ]
        },
        initialFormValidateSkill: {
          "id": null,
          "isLongTerm": 1,
          "productBrand": null,
          "productBrandName": null,
          "productCategory": null,
          "productCategoryName": null,
          "productType": null,
          "engineerId": null,
          "productTypeName": null,
          "type": null,
          "typeName": null
        },
        initialFormValidate: {
          /* 姓名 */
          name: '',
          /* 备注名 */
          remarkName: '',
          /* 手机 */
          telephone: '',
          /* 通讯地址 */
          province: '',
          provinceCode: '',
          city: '',
          cityCode: '',
          district: '',
          districtCode: '',
          street: '',
          streetCode: '',
          postalAddress: '',
          detailedAddress: '',
          /* 学历 */
          education: '',
          // accountCode: '',
          /* 其他电话 */
          otherPhone: '',
          email: '',
          /* 固定电话 */
          phone: '',
          /* 服务商编码 */
          provider: '',
          organization: {
            id: ''
          },
          engineerAwardCertificates: [],
          engineerQualifications: [],
          engineerSkills: []
        },
        formValidate: {
          /* 姓名 */
          name: '',
          /* 备注名 */
          remarkName: '',
          /* 手机 */
          telephone: '',
          /* 通讯地址 */
          province: '',
          provinceCode: '',
          city: '',
          cityCode: '',
          district: '',
          districtCode: '',
          street: '',
          streetCode: '',
          postalAddress: '',
          detailedAddress: '',
          /* 学历 */
          education: '',
          // accountCode: '',
          /* 其他电话 */
          otherPhone: '',
          email: '',
          /* 固定电话 */
          phone: '',
          /* 服务商编码 */
          provider: '',
          organization: {
            id: ''
          },
          engineerAwardCertificates: [],
          engineerQualifications: [],
          engineerSkills: []
        },
        ruleValidate: {
          city: [
            // {required: true, message: '必须选择城市', trigger: 'change'},
          ],
          detailedAddress: [
            // {required: true, message: '详细地区不能为空', trigger: 'blur'},
            {type: 'string', min: 1, max: 50, message: '详细地区不能大于50位', trigger: 'blur'}
          ],
          // accountCode: [
          //   {type: 'string', required: true, message: '必须填写工号', trigger: 'blur'}
          // ],
          district: [
            // {type: 'string', required: true, message: '必须选择区名', trigger: 'change'}
          ],
          education: [
            {type: 'string', required: true, message: '必须选择学历', trigger: 'change'}
          ],
          email: [
            // {type: 'string', required: true, message: '必须填写邮箱', trigger: 'blur'},
            {type: 'string', pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/, message: '输入邮箱不符合规范', trigger: 'blur'}
          ],
          name: [
            {type: 'string', required: true, message: '必须填写姓名', trigger: 'blur'},
            {type: 'string', pattern: /^[\u4E00-\u9FA5A-Za-z0-9]+$/, message: '输入姓名不符合规范', trigger: 'blur'}
          ],
          otherPhone: [
            {type: 'string', pattern: /^[0-9]{0,12}$/, message: '输入其他电话不符合规范', trigger: 'blur'}
          ],
          phone: [
            // {required: true, message: '固定电话不能为空', trigger: 'blur'},
            {type: 'string', pattern: /^[0-9]{0,12}$/, message: '输入固定电话不符合规范', trigger: 'blur'}
          ],
          provider: [
            // {type: 'string', required: true, message: '必须选择服务商', trigger: 'blur'}
          ],
          province: [
            // {type: 'string', required: true, message: '必须选择省份', trigger: 'change'}
          ],
          remarkName: [
            // {type: 'string', required: false, message: '必须填写备注名', trigger: 'blur'}
          ],
          street: [
            // {type: 'string', required: true, message: '必须选择街道', trigger: 'change'}
          ],
          telephone: [
            {required: true, message: '手机号不能为空', trigger: 'blur'},
            {type: 'string', pattern: /^1[34578]\d{9}$/, message: '输入手机号不符合规范', trigger: 'blur'}
          ],
        },
        nameDisabled: false,
        tabs: {
          other: {
            //
          },
          qualification: {
            spin: false,
            columns: [
              {
                  type: 'index',
                  width: 60,
                  align: 'center',
                  title: "编号"
              },
              {
                title: '资质类型',
                key: 'typeName'
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
                render: (h, {row, column, index}) => {
                  console.log(row, 333)
                  let cTime = row.createTime
                  let uTime = row.updateTime
                  return h('div', [
                      h('span', {
                          // on: {
                          //     click: () => {
                          //         // this.show(params.index)
                          //     }
                          // }
                      }, uTime || cTime)
                  ])
                }
              },
              {
                title: '有效期',
                key: 'endTime'
              },
              {
                title: '操作',
                key: 'action',
                render: (h, {row, column, index}) => {
                  let id = row.id
                  console.log(row, 77777)
                  // console.log(row.auditStatus, 777777)
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'text',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px',
                        display: row.auditStatus ?
                                (row.auditStatus === this.CONST.auditStatus.waiting ? 'inline-block' : 'none') :'inline-block'
                      },
                      on: {
                        click: () => {
                          if (this.isUpdate) {
                            this.showUpdateQualificationModal(id)
                          } else {
                            this._showUpdateQualificationModal(index)
                          }
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
                          if (this.isUpdate) {
                            this.updateQualificationIsDelById(id)
                          } else {
                            this._updateQualificationIsDelByIndex(index)
                          }
                        }
                      }
                    }, '删除'),
                  ]);
                }
              }
            ],
            data: [],
            page: 1,
            size: 10,
            total: 10,
            modal: {
              show: false,
              title: '添加/编辑资质证书'
            },
            updateModal: {
              show: false,
              title: '添加/编辑资质证书'
            }
          },
          award: {
            spin: false,
            columns: [
              {
                  type: 'index',
                  width: 60,
                  align: 'center',
                  title: "编号"
              },
              {
                title: '名称',
                key: 'name'
              },
              {
                title: '更新日期',
                key: 'updateTime',
                render: (h, {row, column, index}) => {
                  let cTime = row.createTime
                  let uTime = row.updateTime
                  return h('div', [
                      h('span', {
                          // on: {
                          //     click: () => {
                          //         // this.show(params.index)
                          //     }
                          // }
                      }, uTime || cTime)
                  ])
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
                          if (this.isUpdate) {
                            let src = row.certificatePic
                            this.showCertificationPic(src)
                          } else {
                            this._showCertificationPic(index)
                          }
                        }
                      }
                    }, '查看证书照片'),
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
                          // this.updateAwardById(id)
                          if (this.isUpdate) {
                            this.showUpdateAwardModal(id)
                          } else {
                            this._showUpdateAwardModal(index)
                          }
                        }
                      }
                    }, '编辑'),
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
                          if (this.isUpdate) {
                            this.updateAwardIsDelById(id)
                          } else {
                            this._updateAwardIsDelByIndex(index)
                          }
                        }
                      }
                    }, '删除')
                  ]);
                }
              }
            ],
            data: [],
            page: 1,
            size: 10,
            total: 10,
            modal: {
              show: false,
              title: '添加/编辑获奖证书'
            },
            updateModal: {
              show: false,
              title: '添加/编辑获奖证书'
            }
          },
          skill: {
            spin: false,
            columns: [
              {
                  type: 'index',
                  width: 60,
                  align: 'center',
                  title: "编号"
              },
              {
                title: '品牌',
                key: 'productBrandName'
              },
              {
                title: '产品类型',
                key: 'productCategoryName'
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
                key: 'createTime'
              },
              // {
              //   title: '更新时间',
              //   key: 'updateTime'
              // },
              {
                title: '有效期',
                key: 'isLongTerm',
                render: (h, {row, column, index}) => {
                  let cTime = row.isLongTerm === 1 ? '长期(无到期时间)' : '无'
                  return h('div', [
                      h('span', {
                          // on: {
                          //     click: () => {
                          //     }
                          // }
                      }, cTime)
                  ])
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
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px',
                        // display: row.auditStatus === this.CONST.auditStatus.waiting ? 'inline-block' : 'none'
                      },
                      on: {
                        click: () => {
                          if (this.isUpdate) {
                            this.showUpdateSkillModal(id)
                          } else {
                            this._showUpdateSkillModal(index)
                          }
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
                          if (this.isUpdate) {
                            if (!id) {
                              this.formValidate.engineerSkills.splice(index, 1)
                              this.tabs.skill.data.splice(index, 1)
                            } else {
                              this.updateSkillIsDelById(id)
                            }
                          } else {
                            this.updateSkillIsDelByIndex(index)
                          }
                        }
                      }
                    }, '删除'),
                  ]);
                }
              }
            ],
            data: [],
            page: 1,
            size: 10,
            total: 10,
            modal: {
              show: false,
              title: '添加/编辑技能信息'
            },
            updateModal: {
              show: false,
              title: '添加/编辑技能信息'
            }
          },
        },
        userId: '',
        isEshowBack: false,
        index1: -1,
        UpdateSkillId: '',
        UpdateFlag: false,
        // 是否为最后一个技能信息
        isDelSkillFlag: false
      }
    },
    // 钩子(创建执行)
    created () {
    },
    mounted () {
      this.fillOrganizationName()
    },
    // 方法
    methods: {
      /* 刷新资质/获奖证书 */
      refresh (type) {
        // switch (type) {
        //   case this.CONST.type.qualification:
        //     // this.getQualification(this.id, this.tabs.qualification.page, this.tabs.qualification.size)
        //     this.getEShowBack(this.id, type)
        //     break
        //   case this.CONST.type.award:
        //     // this.getAward(this.id, this.tabs.award.page, this.tabs.award.size)
        //     this.getEShowBack(this.id, type)
        //     break
        // }
        // 表格闪烁以示刷新
        this.tabs.qualification.spin = true
        this.tabs.award.spin = true
        this.tabs.skill.spin = true
        this.getEShowBack(this.id, true)
      },
      /* vue方法清除数据 */
      handleReset(...name) {
        for (let ref of name) {
          this.$refs[ref].resetFields();
        }
      },
      /* 重置资质证书表单数据 */
      resetFormQualification (name) {
        // this.$refs[name].resetFields()
        this.qualificationRowIndex = -1
        // this.handleReset('formValidateQualification')
        this.formValidateQualification = JSON.parse(JSON.stringify(this.initialFormValidateQualification))
      },
      /* 新增工程师的添加资质证书 */
      _addQualification (formValidate) {
        this.$refs[formValidate].validate((valid) => {
          if (valid) {
            let data = JSON.parse(JSON.stringify(this[formValidate]))
            let index = this.qualificationRowIndex
            if (index >= 0) {
              this.tabs.qualification.data[index] = data
              if (this.formValidateQualification.type == 'other') {
                this.tabs.qualification.data[index].typeName = '其他(' + this.formValidateQualification.name + ')'
              }
              this.tabs.qualification.data[index].updateTime = common.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
              /* 触发视图渲染 */
              this.tabs.qualification.data = JSON.parse(JSON.stringify(this.tabs.qualification.data))
              this.formValidate.engineerQualifications[index] = this[formValidate]
              // this.$refs[formValidate].resetFields()
              this.tabs.qualification.modal.show = false
            } else {
              data.updateTime = common.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
              if (this.formValidateQualification.type == 'other') {
                data.typeName = '其他(' + this.formValidateQualification.name + ')'
              }
              this.tabs.qualification.data.push(data)
              this.formValidate.engineerQualifications.push(this[formValidate])
              // this.$refs[formValidate].resetFields()
              this.tabs.qualification.modal.show = false
            }
            this.resetFormQualification(name)
          } else {
            this.$Message.error('请填写所有必填项!')
          }
        })
      },
      /* 编辑工程师的添加资质证书 */
      addQualification (formValidate) {
        this.SubmitLoading = true
        this[formValidate].engineerId = this.id
        this[formValidate].engineerName = this.formValidate.name // 此处的formValidate不是参数，是this.formValidate!
        this[formValidate].engineerService = loginUtils.getUserInfo().organizationName
        this[formValidate].telephone = this.formValidate.telephone
        this.$refs[formValidate].validate((valid) => {
          if (valid) {
            let url = this.isUpdateQualification
                     ? `/user/engineer/updateQualification`
                     : `/user/engineer/saveQualification`
            this.$http.post(url, this[formValidate]).then(({data}) => {
              this.SubmitLoading = false
              if (data.code == $HTTP.SUCCESS) {
                // this.$refs[formValidate].resetFields()
                this.tabs.qualification.modal.show = false
                this.refresh(this.CONST.type.qualification)
                this.$Notice.success({
                  title: '成功提示',
                  desc: this.isUpdate
                     ? `编辑资质证书成功`
                     : `添加资质证书成功`
                })
                /* 重置编辑资质证书判定 */
                this.isUpdateQualification = false
                /* 重置资质证书表单数据 */
                this.handleReset('formValidateQualification')
                this.formValidateQualification = JSON.parse(JSON.stringify(this.initialFormValidateQualification))
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
      /* 重置获奖证书表单数据 */
      resetFormAward (name) {
        // this.handleReset('formValidateAward')
        this.awardRowIndex = -1
        // this.$refs[name].resetFields()
        this.formValidateAward = JSON.parse(JSON.stringify(this.initialFormValidateAward))
        //todo 重置获奖图片
        this.$set(this.picSrc, 'awardPic', defaultPicSrc)
        // this.refs['awardPicInput'].value = ''
        // this.picSrc.awardPic = defaultPicSrc
      },
      resetFormSkill (name) {
        this.UpdateFlag = false
        this.formValidateSkill = JSON.parse(JSON.stringify(this.initialFormValidateSkill))
        this.$refs[name].resetFields()
      },
      fillEducationName (value) {
        let educationName
        Object.values(this.CONST.education).map((item) => {
          if (item.value === value) {
            educationName = item.label
          }
        })
        this.formValidate.educationName = educationName
      },
      /* 新增工程师内编辑/增加证书 */
      _addAward (formValidate) {

        this.$refs[formValidate].validate((valid) => {
          if (valid) {
            /* 数据副本，用于table展示 */
            let data = JSON.parse(JSON.stringify(this[formValidate]))
            let src = this.picSrc.awardPic = this.$refs.awardPic.currentSrc
            /* 本地数据索引 */
            let index = this.awardRowIndex
            /* index > 0则为编辑，否则为增加 */
            if (index >= 0) {
              this.tabs.award.data[index] = data
              if (this.formValidateAward.type == 'other') {
                this.tabs.award.data[index].name = '其他(' + this.formValidateAward.name + ')'
              }
              this.tabs.award.data[index].updateTime = common.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
              /* 触发视图渲染 */
              this.tabs.award.data = JSON.parse(JSON.stringify(this.tabs.award.data))
              // this.tabs.award.data.updateTime =
              this.formValidate.engineerAwardCertificates[index] = this[formValidate]
              this.localAwardPicSrcList[index] = src
            } else {
              if (this.formValidateAward.type == 'other') {
                data.name = '其他(' + this.formValidateAward.name + ')'
              }
              data.updateTime = common.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
              this.tabs.award.data.push(data)
              this.formValidate.engineerAwardCertificates.push(this[formValidate])
              this.localAwardPicSrcList.push(src)
            }
            // this.$refs[formValidate].resetFields()
            this.tabs.award.modal.show = false
            /* 重置更新判定相关数据 */
            this.resetFormAward(formValidate)
          } else {
            this.$Message.error('请填写所有必填项!')
          }
        })

      },
      /* 编辑/添加获奖证书 */
      addAward (formValidate) {
        this.SubmitLoading = true;
        this.$refs[formValidate].validate((valid) => {
          if (valid) {
            let url = this.isUpdateAward
               ? `/user/engineer/updateAwardCertificate`
               : `/user/engineer/saveAwardCertificate`
            this.$http.post(url, this[formValidate]).then(({data}) => {
              this.SubmitLoading = false
              if (data.code == $HTTP.SUCCESS) {
                // this.$refs[formValidate].resetFields()
                this.tabs.award.modal.show = false
                this.refresh()
                this.$Notice.success({
                  title: '成功提示',
                  desc: this.isUpdate
                     ? `编辑获奖证书成功`
                     : `添加获奖证书成功`
                })
                /* 重置更新获奖证书判定 */
                this.isUpdateAward = false
                /* 重置获奖证书表单数据 */
                this.handleReset('formValidateAward')
                this.formValidateAward = JSON.parse(JSON.stringify(this.initialFormValidateAward))
                this.tabs.award.data.push(this[formValidate])
              }
            }, response => {
              this.SubmitLoading = false
            })

          } else {
            this.SubmitLoading = false;
            this.$Message.error('请填写所有必填项!')
          }
        })
      },
      addSkill (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let obj = {}
            obj.isLongTerm = this.formValidateSkill.isLongTerm
            obj.productBrand = this.formValidateSkill.productBrand
            obj.productBrandName = this.formValidateSkill.productBrandName
            obj.productCategory = this.formValidateSkill.productCategory
            obj.productCategoryName = this.formValidateSkill.productCategoryName
            obj.productType = this.formValidateSkill.productType
            obj.engineerId = this.id
            obj.productTypeName = this.formValidateSkill.productTypeName
            obj.type = this.formValidateSkill.type
            obj.typeName = this.formValidateSkill.typeName
            // 技能 - 编辑 - 点击编辑
            if (this.UpdateFlag) {
              obj.id = this.UpdateSkillId

              let url = `/user/engineer/updateSkill`
              this.$http.post(url, obj).then(({data}) => {
                if (data.code == $HTTP.SUCCESS) {
                  this.$Notice.success({
                    title: '成功提示',
                    desc: `编辑技能信息成功`
                  })
                  obj = {}
                  this.UpdateFlag = false
                  this.refresh()
                  this.$refs[name].resetFields()
                  this.tabs.skill.modal.show = false
                  this.clearFormValidate('formValidateSkill')
                }
              }, response => {
              })
            } else {
              obj.userId = this.userId
              let url = `/user/engineer/saveEngineerSkill`
              this.$http.post(url, obj).then(({data}) => {
                if (data.code == $HTTP.SUCCESS) {
                  this.$Notice.success({
                    title: '成功提示',
                    desc: `添加技能信息成功`
                  })
                  obj = {}
                  this.UpdateFlag = false
                  this.refresh()
                  this.$refs[name].resetFields()
                  this.tabs.skill.modal.show = false
                  this.clearFormValidate('formValidateSkill')
                }
              }, response => {
              })
              /* // this.formValidate.engineerSkills.push(this.formValidateSkill)
              for (let item in this.formValidateSkillName) {
                this.formValidateSkill[item] = this.formValidateSkillName[item]
              }
              this.tabs.skill.data.push(this.formValidateSkill)
              console.log(this.tabs.skill.data, 454545) */
            }
            // this.$refs[name].resetFields()
          } else {
            this.$Message.error('请填写所有必填项!');
          }
        })
      },
      _addSkill (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            // 假提交
            let obj = {}
            // obj.id = this.UpdateSkillId,
            obj.isLongTerm = this.formValidateSkill.isLongTerm
            obj.productBrand = this.formValidateSkill.productBrand
            obj.productBrandName = this.formValidateSkill.productBrandName
            obj.productCategory = this.formValidateSkill.productCategory
            obj.productCategoryName = this.formValidateSkill.productCategoryName
            obj.productType = this.formValidateSkill.productType
            // obj.engineerId = this.id
            obj.productTypeName = this.formValidateSkill.productTypeName
            obj.type = this.formValidateSkill.type
            obj.typeName = this.formValidateSkill.typeName
            /* let obj = {}
            obj = this.formValidateSkill
            // 品牌
            obj.productBrand = this.formValidateSkillName.productBrandName
            // 产品类型
            obj.productType = this.formValidateSkill.productType
            // 技能类型
            obj.auditStatusName = this.formValidateSkill.typeName
            // 有效期
            obj.isLongTerm = this.formValidateSkill.type */
            // 如果通过编辑进来就替换
            if (this.index1 >= 0) {
              this.formValidate.engineerSkills.splice(this.index1, 1, this.changeObj(obj))
              obj.createTime = common.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
              this.tabs.skill.data.splice(this.index1, 1, this.changeObj(obj))
            } else {
              this.formValidate.engineerSkills.push(this.changeObj(obj))
              obj.createTime = common.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
              this.tabs.skill.data.push(this.changeObj(obj))
            }
            this.$refs[name].resetFields()
            this.tabs.skill.modal.show = false
            this.clearFormValidate('formValidateSkill')

            // this.$refs[name].resetFields()
          } else {
            this.$Message.error('请填写所有必填项!');
          }
        })
      },
      changeObj (obj) {
        return JSON.parse(JSON.stringify(obj))
      },
      clearFormValidate (formValidate) {
        let capitalFormValidate = formValidate.replace(formValidate[0], formValidate[0].toUpperCase())
        this[formValidate] = JSON.parse(JSON.stringify(this['initial' + capitalFormValidate]))
      },
      firstGetQualificationType () {
        if (this.isFirstOpen.addQualification) {
          let url = `lookup/dictionary/getDictionariesByTypeWithSub`
          let params = `?type=QUALIFICATIONTYPE`
          this.$http.get(url + params).then(({data}) => {
            if (data.code == $HTTP.SUCCESS) {
              data.data.DictList.unshift({
                description: '请选择',
                code: ''
              })
              this.CONST.qualification = data.data.DictList
              // this.table.data = data.data.content
              this.isFirstOpen.addQualification = false
            }
          })
        }
      },
      fillTypeNameByCode (typeCode, _type) {
        switch (_type) {
          case 'qualification':
            this.CONST.qualification.map((item) => {
              if (item.code === typeCode) {
                // 类型不为'其他'的将类型名称填充至名称字段
                if (item.code !== 'other') {
                  this.formValidateQualification.name = item.description
                }
                this.formValidateQualification.typeName = item.description
              }
            })
            break
          case 'award':
            this.CONST.award.map((item) => {
              if (item.code === typeCode) {
                // 类型不为'其他'的将类型名称填充至名称字段
                if (item.code !== 'other') {
                  this.formValidateAward.name = item.description
                }/*  else {
                  this.formValidateAward.name = '其他(' + item.description + ')'
                } */
                this.formValidateAward.typeName = item.description
              }
            })
            break
        }
      },
      showQualificationModal () {
        /* 请求资质类型 */
        this.firstGetQualificationType()
        this.qualificationTitle = '添加/编辑资质证书'
        /* 重置编辑提交状态 */
        this.isUpdateQualification = false
        this.tabs.qualification.modal.show = true
      },
      /* 获取获奖证书类型 */
      firstGetAwardType () {
        if (this.isFirstOpen.addAward) {
          let url = `lookup/dictionary/getDictionariesByTypeWithSub`
          let params = `?type=ENGINEERAWARD`
          this.$http.get(url + params).then(({data}) => {
            if (data.code == $HTTP.SUCCESS) {
              this.CONST.award = data.data.DictList
              // this.table.data = data.data.content
              this.isFirstOpen.addAward = false
            }
          })
        }
      },
      showSkillModalForAdd () {
        this.skillTitle = '添加/编辑技能信息'
        this.index1 = -1
        this.UpdateFlag = false
        this.tabs.skill.modal.show = true
        this.firstGetSkillType()
      },
      showAwardModalForAdd () {
        this.awardTitle = '添加/编辑获奖证书'
        this.awardPicisUpdate = false
        this.showAwardModal()
      },
      showAwardModal () {
        /* 请求资质类型 */
        this.firstGetAwardType()
        this.tabs.award.modal.show = true
      },
      firstGetSkillType () {

      },
      pageChangeQualification(page) {
        this.tabs.qualification.page = page;
        this.getQualification(this.id, this.tabs.qualification.page, this.tabs.qualification.size)
      },
      /* 改变页面容量，重新加载 */
      pageSizeChangeQualification(size) {
        this.tabs.qualification.size = size;
        this.getQualification(this.id, this.tabs.qualification.page, this.tabs.qualification.size)
      },
      getQualification (id, page, size) {
        let url = `/user/engineer/getQualificationByEngineerId`
        let params = `?engineerId=${id}&page=${page}&size=${size}`
        this.$http.get(url + params).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.tabs.qualification.data = data.data.content
          }
        })
      },
      pageChangeAward (page) {
        this.tabs.award.page = page;
        this.getAward(this.id, this.tabs.award.page, this.tabs.award.size)
      },
      /* 改变页面容量，重新加载 */
      pageSizeChangeAward (size) {
        this.tabs.award.size = size;
        this.getAward(this.id, this.tabs.award.page, this.tabs.award.size)
      },
      getAward (id, page, size) {
        let url = `/user/engineer/getAwardCertificateByEngineerId`
        let params = `?engineerId=${id}&page=${page}&size=${size}`
        this.$http.get(url + params).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            console.log(data)
            this.tabs.qualification.data = data.data.content
          }
        })
      },
      _updateQualificationIsDelByIndex (index) {
        this.tabs.qualification.data.splice(index, 1)
      },
      /* 删除资质证书 */
      updateIsDelQualification (id) {
        let url = `/user/engineer/deleteQualification`
        let params = `?qualificationId=${id}`
        this.$http.post(url + params, {
          headers: {
            'content-type': 'application/json;charset=UTF-8'
          }
        }).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.$Modal.remove()
            this.refresh(this.CONST.type.qualification)
            this.$Notice.success({
              title: '成功提示',
              desc: `删除证书成功`
            })
          }
        })
      },
      /* 确认删除资质证书 */
      updateQualificationIsDelById (id) {
        // let ids = [id]
        this.$Modal.confirm({
          title: '确认提示',
          content: '确认要删除证书吗？',
          loading: true,
          onOk: () => {
            this.updateIsDelQualification(id)
            // todo 删除
          }
        })
      },
      _updateAwardIsDelByIndex (index) {
        this.tabs.award.data.splice(index, 1)
        this.localAwardPicSrcList.splice(index, 1)
      },
      /* 删除获奖证书 */
      updateIsDelAward (id) {
        let url = `/user/engineer/deleteAwardCertificateByAwardId`
        let params = `?awardId=${id}`
        this.$http.post(url + params, {
          headers: {
            'content-type': 'application/json;charset=UTF-8'
          }
        }).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.$Modal.remove()
            this.refresh(this.CONST.type.award)
            this.$Notice.success({
              title: '成功提示',
              desc: `删除证书成功`
            })
          }
        })
      },
      /* 确认删除获奖证书 */
      updateAwardIsDelById (id) {
        // let ids = [id]
        this.$Modal.confirm({
          title: '确认提示',
          content: '确认要删除证书吗？',
          loading: true,
          onOk: () => {
            this.updateIsDelAward(id)
            // todo 删除
          }
        })
      },
      ruleOrganization () {
        // todo
      },
      updateEngineer (formValidate) {
        /* 填充地址到formValidate */
        this.getAddressNameByCode()
        /* 判断其他电话与手机号是否相同 */
        if (this.formValidate.otherPhone === this.formValidate.telephone) {
          this.$Message.error('其他电话与手机号不能相同!')
          return
        }
        if (!this.isAddressNullOrFull) {
          this.$Message.error('地址必须全选或者全不选!')
          return
        }
        this.SubmitLoading = true
        let url = `/user/engineer/updateEngineer`
        this.$refs[formValidate].validate((valid) => {
          if (valid) {
            // 编辑状态下无需假提交
            delete this.formValidate.engineerAwardCertificates
            delete this.formValidate.engineerQualifications
            delete this.formValidate.engineerSkills
            // delete this.formValidate.engineerAwardCertificates
            this.$http.post(url, this.formValidate).then(({data}) => {
              this.SubmitLoading = false
              if (data.code == $HTTP.SUCCESS) {
                this.modalShow = false
                // todo
                this.emitSubmitSuccess()
                this.$Notice.success({
                  title: '成功提示',
                  desc: `编辑工程师成功`
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
      fillOrganizationName () {
        /* 资质证书添加组织id与名称 */
        this.formValidateQualification.engineerService = loginUtils.getUserInfo().organizationName
        // this.formValidateQualification.organizationId = loginUtils.getUserInfo().organizationId
        /* 获奖证书添加组织id与名称 */
        this.formValidateAward.engineerService = loginUtils.getUserInfo().organizationName
        // this.formValidateAward.organizationId = loginUtils.getUserInfo().organizationId
      },
      addEngineer (formValidate) {
        if (loginUtils.getUserInfo().id ===1 || loginUtils.getUserInfo().SYSTEM.length) {
          this.$Notice.error({
            title: '警告提示',
            desc: `系统管理员不能新增工程师`
          })
          return
        }
        this.getAddressNameByCode()
        this.formValidate.organization.id = loginUtils.getUserInfo().organizationId
        // this.formValidate.providerName = loginUtils.getUserInfo().organizationName
        /* 判断其他电话与手机号是否相同 */
        /* if (this.formValidate.otherPhone === this.formValidate.telephone) {
          this.$Message.error('其他电话与手机号不能相同!')
          return
        }
        // 判断地址全选或全不选
        if (!this.isAddressNullOrFull) {
          this.$Message.error('地址必须全选或者全不选!')
          return
        } */
        this.SubmitLoading = true;
        let url = `/user/engineer/saveEngineer`
        this.$refs[formValidate].validate((valid) => {
          if (valid) {
            let userInfo = common.getStorage('USER_KEY');
            //校验当前登录的是否是非自建服务商
            this.$http.get('/user/organization/isExistServerByOrganizationId?organizationId=' + userInfo.organizationId).then(({data}) => {
              if(data.code == $HTTP.SUCCESS){
                let status = data.data;
                if(status == 0){
                  this.submitAJaxAddEngineer(url);
                }else if(status == 3){
                  this.SubmitLoading = false;
                  this.$Notice.error({
                    title: '警告提示',
                    desc: `当前登录账号非服务商`
                  })
                }else if(status == 4){
                  this.SubmitLoading = false;
                  this.$Notice.error({
                    title: '警告提示',
                    desc: `分公司员工请统一在CRM中进行维护`
                  })
                }else{
                  this.SubmitLoading = false;
                  this.$Message.error('系统错误')
                }
              }else{
                this.SubmitLoading = false;
                this.$Message.error('系统错误')
              }
            }, response => {
              this.SubmitLoading = false
            });
          } else {
            this.SubmitLoading = false;
            this.$Message.error('请填写所有必填项!')
          }
        })
      },
      submitAJaxAddEngineer(url) {
        let organizationName = loginUtils.getUserInfo().organizationName
        this.formValidate.organization.name = organizationName
        this.$http.post(url, this.formValidate).then(({data}) => {
          this.SubmitLoading = false
          if (data.code == $HTTP.SUCCESS) {
            this.modalShow = false
            // this.$emit('on-cancel')
            // todo
            // this.emitSuccess()
            this.$Notice.success({
              title: '成功提示',
              desc: `添加工程师成功`
            })
            this.emitSubmitSuccess()
          }
        }, response => {
          this.SubmitLoading = false
        })
      },
      emitSubmitSuccess () {
        this.$emit('submit-success', true)
      },
      getAddressNameByCode () {
        /* 获取省名 */
        let provinceName
        this.address.province.forEach((item) => {
          if (item.provinceCode === this.formValidate.provinceCode) {
            provinceName = item.provinceName
          }
        })
        this.formValidate.province = provinceName
        /* 获取市名 */
        let cityName
        this.address.city.forEach((item) => {
          if (item.cityCode === this.formValidate.cityCode) {
            cityName = item.cityName
          }
        })
        this.formValidate.city = cityName
        /* 获取区名 */
        let districtName
        this.address.district.forEach((item) => {
          if (item.districtCode === this.formValidate.districtCode) {
            districtName = item.districtName
          }
        })
        this.formValidate.district = districtName
        /* 获取街道名 */
        let streetName
        this.address.street.forEach((item) => {
          if (item.streetCode === this.formValidate.streetCode) {
            streetName = item.streetName
          }
        })
        this.formValidate.street = streetName
        if (!this.formValidate.cityCode) {
          this.formValidate.city = ''
          cityName = ''
        }
        if (!this.formValidate.provinceCode) {
          this.formValidate.provinceName = ''
          this.formValidate.province = ''
          provinceName = ''
        }
        if (!this.formValidate.districtCode) {
          this.formValidate.districtName = ''
          this.formValidate.district = ''
          districtName = ''
        }
        if (!this.formValidate.streetCode) {
          this.formValidate.streetName = ''
          this.formValidate.street = ''
          streetName = ''
        }
        // 拼接地址（通讯地址）
        this.formValidate.postalAddress = provinceName + cityName + districtName + streetName
      },
      /* 获取省列表 */
      getAllProvince () {
        if (!this.isFirstGet.province) {
          return
        }
        let url = `/lookup/address/listProvince`
        this.$http.get(url).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            console.log(data)
            this.address.province = this.initialAddress.province.concat(data.data.provinceList)
            this.isFirstGet.province = false
          }
        })
      },
      setEShowBackFalse () {
        this.isEshowBack = false
      },
      resetCity () {
        /* 重置option值 */
        this.address.city = [{
          cityCode: '',
          cityName: '请选择'
        }]
        /* 重置select值 */
        this.formValidate.cityCode = ''
        this.formValidate.city = '请选择'
      },
      resetDistrict () {
        /* 重置option值 */
        this.address.district = [{
          districtCode: '',
          districtName: '请选择'
        }]
        /* 重置select值 */
        this.formValidate.districtCode = ''
        this.formValidate.district = '请选择'
      },
      resetStreet () {
        /* 重置option值 */
        this.address.street = [{
          streetCode: '',
          streetName: '请选择'
        }]
        /* 重置select值 */
        this.formValidate.streetCode = ''
        this.formValidate.street = '请选择'
      },
      /* 根据省id获取市列表 */
      getCityByProvinceId (id) {
        /* id为空字符串则为请选择 */
        if (id !== '' && !id) {
          return
        }
        let url = `/lookup/address/listCityByProvinceCode`
        let params = `?provinceCode=${id}`
        // 如果不是回显数据则重置市区街
        if (!this.isEshowBack) {
          this.resetCity()
          this.resetDistrict()
          this.resetStreet()
        }
        if (id !== '') {
          this.$http.get(url + params).then(({data}) => {
            if (data.code == $HTTP.SUCCESS) {
              this.address.city = this.initialAddress.city.concat(data.data.cityList)
              this.isFirstGet.city = false
            }
          })
        }
      },
      /* 根据市id获取区列表 */
      getDistrictByCityId (id) {
        /* id为空字符串则为请选择 */
        if (id !== '' && !id) {
          return
        }
        let url = `/lookup/address/listDistrictByCityCode`
        let params = `?cityCode=${id}`
        // 重置区街
        if (!this.isEshowBack) {
          this.resetDistrict()
          this.resetStreet()
        }
        // this.handleReset('district', 'street')
        if (id !== '') {
          this.$http.get(url + params).then(({data}) => {
            if (data.code == $HTTP.SUCCESS) {
              this.address.district = this.initialAddress.district.concat(data.data.districtList)
              this.isFirstGet.district = false
            }
          })
        }
      },
      /* 根据区id获取街道列表 */
      getStreetByDistrictId (id) {
        /* id为空字符串则为请选择 */
        if (id !== '' && !id) {
          return
        }
        let url = `/lookup/address/listStreetByDistrictCode`
        let params = `?districtCode=${id}`
        // 重置街
        if (!this.isEshowBack) {
          this.resetStreet()
        }
        // this.handleReset('street')
        if (id !== '') {
          this.$http.get(url + params).then(({data}) => {
            if (data.code == $HTTP.SUCCESS) {
              console.log(data)
              this.address.street = this.initialAddress.street.concat(data.data.streetList)
              this.isFirstGet.street = false
            }
          })
        }
      },
      /* 获取回显 */
      getEShowBack (id, isRefresh) {
        let url = `/user/engineer/findEngineerById`
        let params = `?id=${id}`
        this.$http.get(url + params).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            if (!isRefresh) {
              this.isEshowBack = true
              Object.assign(this.formValidate, data.data)
              /* 获取修正手机号和头像数据 */
              this.formValidate.telephone = this.formValidate.user.mobile
              this.formValidate.headPic = this.formValidate.user.headPic

              this.formValidateQualification.engineerId = data.data.id
              this.userId = data.data.user.id
              this.formValidateAward.engineerId = data.data.id

              // 获取回显头像
              let headPicID = this.formValidate.headPic
              // disabled判断String或Number会报错
              this.nameDisabled = this.formValidate.idCardNo ? true : false // 有idNo，禁止编辑姓名
              /* this.picSrc.headPic =  */this.getPicSrcById(headPicID, this.fillSrc('headPic'))
              // 获取技能信息
              // this.getSkillInfo(data.data.id)
              // this.title = '编辑工程师'
            }

            this.tabs.qualification.data = data.data.engineerQualifications
            this.tabs.qualification.data.forEach((item, index) => {
              if (item.type === 'other') {
                this.tabs.qualification.data[index].typeName = '其他(' + this.tabs.qualification.data[index].name + ')'
              }
            })
            this.tabs.award.data = data.data.engineerAwardCertificates
            this.tabs.award.data.forEach((item, index) => {
              if (item.type === 'other') {
                this.tabs.award.data[index].name = '其他(' + this.tabs.award.data[index].name + ')'
              }
            })
            this.tabs.skill.data = data.data.engineerSkills
            // 是否为最后一个技能信息
            data.data.engineerSkills.length === 1 ? this.isDelSkillFlag = true :
                                                    this.isDelSkillFlag = false
            this.tabs.qualification.spin = false
            this.tabs.award.spin = false
            this.tabs.skill.spin = false

          }
        })
      },
      getSkillInfo (id) {
        let url = `/user/engineer/getEngineerSkillById`
        let params = `?engineerSkillId=${id}`
        // this.tabs.qualification.spin = true
        // this.tabs.award.spin = true
        this.$http.get(url + params).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            if (data.data) {

              let brand = data.data.productBrand
              let brandName = data.data.productBrandName
              let category = data.data.productCategory
              let categoryName = data.data.productCategoryName
              // 技能 - 获取产品大类
              this.getProductType(brand, brandName, category)
              // 技能 - 获取产品小类
              this.getProductCategory (category, categoryName, data.data.productType)
              this.formValidateSkill = data.data
            }
          }
        })
      },
      fillHeadPicFormValidate (id) {
        this.formValidate.headPic = id
      },
      resetBigImgSrc () {
        this.bigImgModal.show = false
        /* 延迟200ms重置图片src */
        setTimeout(() => {
          this.$set(this.bigImgModal, 'src', defaultPicSrc)
          // this.bigImgModal.src = defaultPicSrc
        }, 200)
      },
      /**
       * 展示大图
       * @param param 可能值为src或是window.event
       */
      showBigImg (param) {
        this.bigImgModal.show = true
        // if (!param) {
        //   return
        // }
        // if (typeof param === 'string') {
        //   this.bigImgModal.src = param
        // } else {
        //   let src = param.target.currentSrc
        //   this.bigImgModal.src = src
        // }
      },
      showCertificationPic (id) {
        /* this.bigImgModal.src =  */this.getPicSrcById(id, this.fillSrc('bigImg'))
        this.showBigImg()
      },
      _showCertificationPic (index) {
        this.bigImgModal.src = this.localAwardPicSrcList[index]
        this.showBigImg()
      },
      fillUploadAwardFormValidate (id) {
        this.formValidateAward.certificatePic = id
      },
      updateUploadAwardPic($preview, $file) {
        let _this = this
        this.uploadPic($preview, $file, _this.fillUploadAwardFormValidate)
        this.awardPicisUpdate = true
      },
      clickUploadPic () {
        // 点击了input<file>框
        this.$refs.headPicInput.click()
      },
      uploadPic ($preview, $file, fillFormValidate) {
        let preview = this.$refs[$preview]
        let file = this.$refs[$file].files[0]
        let _this = this
        if (file) {
          if (file.size <= 5000000) {
            this.uploadLoading = true
            this.uploadBtnText = '上传中...'
            let reader = new FileReader()
            // console.log(file, '454')
            reader.onloadend = function () {
              /* this从vue实例变为reader */
              let formData = new FormData()
              formData.append('file', file)
              let _file = this.result
              let url = `/document/document/uploadDocument`
              _this.$http.post(url, formData, {
                cache: false,
                processData: false,
                contentType: false
              }).then(({data}) => {
                if (data.code == $HTTP.SUCCESS) {
                  _this.uploadLoading = false
                  /* 预览图片 */
                  switch($preview) {
                    case 'headPic':
                      _this.picSrc.headPic = _file
                      break
                    case 'awardPic':
                      _this.picSrc.awardPic = _file
                      break
                  }
                  // preview.src = _file
                  fillFormValidate(data.data.id)
                  _this.uploadBtnText = '更改'
                  _this.$Notice.success({
                    title: '成功提示',
                    desc: `添加图片成功`
                  })
                }
              }, response => {
                _this.uploadLoading = false
                _this.uploadBtnText = '上传'
              })
            }
            if (file) {
              reader.readAsDataURL(file)
            } else {
              preview.src = defaultPicSrc
            }
          } else {
            this.$Notice.warning({
              title: '警告提示',
              desc: `请上传小于5兆的图片`
            })
            this.uploadLoading = false
          }
        } else {
          this.uploadLoading = false
        }
      },
      /* 编辑未提交的资质 */
      _showUpdateQualificationModal (index) {
        this.qualificationTitle = '添加/编辑资质证书'
        this.tabs.qualification.modal.show = true
        this.qualificationRowIndex = index
        this.formValidateQualification = this.formValidate.engineerQualifications[index]
      },
      /* 展示资质弹窗 */
      showUpdateQualificationModal (id) {
        this.qualificationTitle = '添加/编辑资质证书'
        this.isUpdateQualification = true
        this.tabs.qualification.modal.show = true
        // 请求
        this.firstGetQualificationType()
        let url = `/user/engineer/getQualificationById`
        let params = `?qualificationId=${id}`
        this.$http.get(url + params).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            let cdata = data.data
            /* 解析数据 */
            this.formValidateQualification = data.data
          }
        })
      },
      _showUpdateAwardModal (index) {
        this.awardTitle = '添加/编辑获奖证书'
        this.awardPicisUpdate = true
        this.tabs.award.modal.show = true
        this.awardRowIndex = index
        this.picSrc.awardPic = this.localAwardPicSrcList[index]
        this.formValidateAward = this.formValidate.engineerAwardCertificates[index]
      },
      /* 展示获奖弹窗 */
      showUpdateAwardModal (id) {
        this.awardTitle = '添加/编辑获奖证书'
        this.awardPicisUpdate = true
        this.isUpdateAward = true
        this.tabs.award.modal.show = true
        //请求
        this.firstGetAwardType()
        let url = `/user/engineer/findAwardCertificateByAwardId`
        let params = `?awardId=${id}`
        this.$http.get(url + params).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            let cdata = data.data
            /* 解析数据 */
            this.formValidateAward = data.data
            let certificatePicId = data.data.certificatePic
            /* this.picSrc.awardPic =  */this.getPicSrcById(certificatePicId, this.fillSrc('awardPic'))
            this.awardPicisUpdate = true
          }
        })
      },
      fillSrc (type) {
        let _this = this
        return function (src) {
          switch (type) {
            case 'awardPic':
              _this.$set(_this.picSrc, 'awardPic', src)
              // _this.picSrc.awardPic = src
              break
            case 'headPic':
              _this.$set(_this.picSrc, 'headPic', src)
              // _this.picSrc.headPic = src
              break
            case 'bigImg':
              _this.$set(_this.bigImgModal, 'src', src)
              // _this.bigImgModal.src = src
              break
          }
          _this.$forceUpdate()
        }
      },
      /* 根据id为所需的img赋予src */
      getPicSrcById (id, cb) {
          if (id) {
            let url = `/document/document/getDocumentByID`
            let params = `?documentID=${id}`
            this.$http.get(url + params).then(({data}) => {
              if (data.code == $HTTP.SUCCESS) {
                let cdata = data.data.Document
                /* 解析数据 */
                let src = cdata.accessUrl
                return src
              }
            }).then((src) => {
              cb(src)
            })
          }
      },
      /* 编辑资质详情 */
      updateQualificationById () {

      },
      /* 编辑获奖详情 */
      updateAwardById () {

      },
      /* 重置所有数据 */
      resetAllFormValidates () {
        /* 重置姓名可写性 */
        this.nameDisabled = false
        /* tab指向第一页 */
        this.tabValue = 'other'
        /* 重置主表单 */
        this.handleReset('formValidate')
        this.formValidate = JSON.parse(JSON.stringify(this.initialFormValidate))
        /* 重置表格 */
        this.tabs.qualification.data = []
        this.tabs.award.data = []
        this.tabs.skill.data = []
        // this.formValidateSkillName = []
        /* 重置图片 */
        this.$set(this.picSrc, 'headPic', defaultPicSrc)
        // this.picSrc.headPic = null
        this.$set(this.bigImgModal, 'src', defaultPicSrc)
        // this.bigImgModal.src = null
        /* 重置input */
        // this.$refs['headPicInput'].value = ''
      },
      // 技能 - 获取所有品牌
      getAllActive () {
        this.productBrand = [
          {
            code: '',
            name: '请选择'
          }
        ]
        let url = `product/productBrand/getAllActive`
        this.$http.get(url).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            data.data.forEach((item, index) => {
              this.productBrand.push(item)
            })
          }
        })
      },
      // 技能 - 获取产品大类
      getProductType (brand, name, obj) {
        // 清空后续选项值
        this.productCategory = [
          {
            code: '',
            name: '请选择'
          }
        ]
        this.productType = [
          {
            code: '',
            name: '请选择'
          }
        ]
        if (brand) {
          // 品牌名称放到假提交
          this.formValidateSkill.productBrandName = name
        }
        if (!obj) {
          // 如果产品大类
          if (this.formValidateSkill.productCategory) {
            console.log(this.formValidateSkill.productCategory, 99999)
            this.formValidateSkill.productCategory = ''
          }
          this.formValidateSkill.productType = ''
        }

        // 根据品牌获取产品大类
        if (brand) {
          let url = `product/productCategory/getActiveByBrand`
          let params = `?brand=${brand}`
          this.$http.get(url + params).then(({data}) => {
            if (data.code == $HTTP.SUCCESS) {
              data.data.forEach((item, index) => {
                this.productCategory.push(item)
                // obj ? this.formValidateSkill = obj : ''
              })
              obj ? this.formValidateSkill.productCategory = obj : ''
            }
          })
        }
      },
      // 技能 - 获取产品小类
      getProductCategory (category, name, obj) {
        // 清空后续选项值
        this.productType = [
          {
            code: '',
            name: '请选择'
          }
        ]
        if (category) {
          this.formValidateSkill.productCategoryName = name
        }
        if (!obj) {
          this.formValidateSkill.productType = ''
        }

        // 根据产品大类获取产品小类
        if (category) {
          let url = `product/productType/getActiveByCategory`
          let params = `?category=${category}`
          this.$http.get(url + params).then(({data}) => {
            if (data.code == $HTTP.SUCCESS) {
              data.data.forEach((item, index) => {
                this.productType.push(item)
              })
              obj ? this.formValidateSkill.productType = obj : ''
            }
          })
        }
      },
      // 技能 - 技能类型
      changeskillType (code, name) {
        // this.formValidateSkill.type = code
        if (code) {
          this.formValidateSkill.typeName = name
        } else {
          this.formValidateSkill.typeName = ''
        }
      },
      // 技能 - 有效期
      changeIsLongTerm (code, name) {
        this.formValidateSkill.isLongTerm = code
      },
      changeProductCategory (val, name) {
        if (val) {
          this.formValidateSkill.productTypeName = name
        } else {
          this.formValidateSkill.productTypeName = ''
        }
      },
      // 获取技能 - 技能类型
      getSkillType () {
        this.type= [
          {
            code: '',
            description: '请选择'
          }
        ]
        let url = `lookup/dictionary/listby?type=ENGINEERSKILL`
        this.$http.get(url).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            data.data.DictList.forEach((item, index) => {
              this.type.push(item)
            })
          }
        })
      },
      // 新增 - 技能 - 编辑按钮
      _showUpdateSkillModal (index) {
        this.skillTitle = '添加/编辑技能信息'
        console.log(this.formValidate.engineerSkills[index], '4545')
        this.index1 = index
        this.tabs.skill.modal.show = true
        let item = this.changeObj(this.formValidate.engineerSkills[index])
        let brand = item.productBrand
        let brandName = item.productBrandName
        let category = item.productCategory
        let categoryName = item.productCategoryName
        // 技能 - 获取产品大类
        this.getProductType(brand, brandName, category)
        // 技能 - 获取产品小类
        this.getProductCategory (category, categoryName, item.productType)
        this.formValidateSkill = item
      },
      // 编辑提交
      UpdateSkill1 () {
        let url = `/user/engineer/updateSkill`
        this.$http.post(url, {

        }).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.refresh()
            this.$Notice.success({
              title: '成功提示',
              desc: `编辑技能信息成功`
            })
          }
        }, response => {
        })
      },
      // 编辑 - 技能 - 编辑按钮
      showUpdateSkillModal (id) {
        this.skillTitle = '添加/编辑技能信息'
        this.UpdateFlag = true
        this.UpdateSkillId = id
        this.getSkillInfo(id)
        this.tabs.skill.modal.show = true

      },
      // 新增 - 技能 - 删除按钮
      updateSkillIsDelByIndex (index) {
        this.formValidate.engineerSkills.splice(index, 1)
        this.tabs.skill.data.splice(index, 1)
      },
      // 编辑 - 技能 - 删除按钮
      updateSkillIsDelById (id) {
        let content = '确认删除技能信息吗？'
        this.isDelSkillFlag ? content = '请注意：工程师没有技能将自动变为挂起状态！' : ''
        this.$Modal.confirm({
          title: '确认提示',
          content: content,
          loading: true,
          onOk: () => {
            this.postDelSkill(id)
          }
        })
      },
      // 删除技能
      postDelSkill (id) {
        console.log(id, 9999)
        let url = `/user/engineer/deleteSkill?skillId=${id}`
        this.$http.post(url).then(({data}) => {
          if (data.code == $HTTP.SUCCESS) {
            this.refresh()
            this.$Notice.success({
              title: '成功提示',
              desc: `删除技能信息成功`
            })
            this.$Modal.remove()
          }
        }, response => {
          alert(response)
          this.$Modal.remove()
        })
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
      },
      isAddressNullOrFull () {
        let isFull = this.formValidate.provinceCode !== ''
          && this.formValidate.cityCode !== ''
          && this.formValidate.districtCode !== ''
          && this.formValidate.streetCode !== ''
        let isNull = this.formValidate.provinceCode == ''
          && this.formValidate.cityCode == ''
          && this.formValidate.districtCode == ''
          && this.formValidate.streetCode == ''
        return isFull || isNull
      }
      // nameDisabled () {
      //   return this.formValidate.idCardNo
      // }
    },
    watch: {
      modalShow (val) {
        if (!val) {
          /* 重置所有数据 */
          setTimeout(this.resetAllFormValidates, 200)
        }
        /* 首次弹出获取地址列表 */
        if (this.isFirstOpen.mainModal && this.value) {
          this.getAllProvince()

          this.getAllActive()
          this.getSkillType()
          this.isFirstOpen.mainModal = false
        }
        /* 是否请求回显数据 */
        if (this.isUpdate && val) {
          this.getEShowBack(this.id)
        } else if (val && (loginUtils.getUserInfo().id ===1 || loginUtils.getUserInfo().SYSTEM.length)) {
          this.$Notice.error({
            title: '警告提示',
            desc: `系统管理员不能新增工程师`
          })
        }
        this.uploadBtnText = '上传'
        this.uploadLoading = false
      }
    }
  }
</script>
<style scoped lang="scss">
  .ivu-upload {
    margin-top: 5px;
  }
  .ivu-upload-drag {
    border-color: transparent;

    &:hover {
      border-color: transparent;
    }
  }
  .demo-upload-list-cover {
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,.6);
  }
  .ivu-upload:hover .demo-upload-list-cover {
      display: block;
  }
  .demo-upload-list-cover i {
      color: #fff;
      font-size: 24px;
      cursor: pointer;
      margin: 0 2px;
  }
  .demo-upload-list-cover .icon-list {
    width: 100%;
    text-align: center;
    position: absolute;
    top: 50%;
    margin-top: -16px;
  }
  .upload-img {
    input {
      opacity: 0;
    }

    img {
      float: left;
      width: 58px;
      height: 58px;
      margin-right: 5px;
    }

    .uploader {
      float: left;
      cursor: pointer;
      width: 58px;
      height: 58px;
      line-height: 58px;
      border: 1px dashed #999;
      border-radius: 3px;
      position: relative;
      transition: all .15s linear 0s;

      &.hide-in-img {
        position: absolute;
        top: 0;
        left: 0;
        // visibility: hidden;
        opacity: 0;
      }

      &:hover {
        border-color: #2d8cf0;

        &:before,
        &:after {
          background-color: #2d8cf0;
        }
      }

      &:before {
        content: '';
        width: 20px;
        height: 2px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-top: -1px;
        margin-left: -10px;
        background-color: #999;
      }

      &:after {
        content: '';
        width: 2px;
        height: 20px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-top: -10px;
        margin-left: -1px;
        background-color: #999;
      }
    }
  }

  .preview-outer {
    display: inline-block;
    position: relative;

    .preview-mask {
      cursor: pointer;
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 58px;
      height: 58px;
      background-color: rgba(0,0,0,.5);
      transition: all .2s linear 0s;
      text-align:center;
      line-height: 58px;
    }

    &:hover {
      .preview-mask {
        display: block;
        color: #fff;
      }
    }
  }

  .starFlag {
  position: relative;
  &::before {
    content: '*';
    z-index: 999;
    position: absolute;
    top: 50%;
    left: -1px;
    transform: translate(-100%, -50%);
    font-family: SimSun;
    font-size: 12px;
    color: #ed3f14;
  }
}
.starFlag1 {
  position: relative;
  &::before {
    content: '*';
    z-index: 999;
    position: absolute;
    top: 50%;
    right: 35px;
    transform: translate(-50%, -50%);
    font-family: SimSun;
    font-size: 12px;
    color: #ed3f14;
  }
}
.starFlag2 {
  position: relative;
  &::before {
    content: '*';
    z-index: 999;
    position: absolute;
    top: 15px;
    left: 13px;
    transform: translate(-50%, -50%);
    font-family: SimSun;
    font-size: 12px;
    color: #ed3f14;
  }
}
</style>

