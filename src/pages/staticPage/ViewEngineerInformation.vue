<template>
  <div class="tablePanel">
    <div class="ivu-title flex mb-10">
       <div class="ivu-title-name f-18"><Icon type="navicon" class="mr-10"></Icon>工程师信息</div>
       <div class="ivu-title-button ml-10"><Button type="ghost" class="ivu-btn-default">编辑</Button></div>
    </div>
    <div class="ivu-information-box clearfix">
      <div class="ivu-information-box-img f-l"><img :src=" idPhoto3 " alt="">

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
            <li class="color-ligth-blue">{{ state }}</li>
            <li>{{ fullName }}</li>
            <li>{{ moblie }}</li>
            <li>{{ serial }}</li>
            <li>{{ serviceStar }}</li>
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

            <li>{{ gender }}</li>
            <li>{{ dateOfBirth }}</li>
            <li>{{ age }}</li>
            <li>{{ creationDate }}</li>
            <li>{{ updateDate }}</li>
          </ul>
      </div>
    </div>
    <Tabs type="card" value="name1" class="mt-20">
        <TabPane label="其他个人信息" name="name1">
          <div class="ivu-tabs-text f-14 p-20">
            <div class="w-sty1 clearfix">
              <div class="ta-l f-l w-sty1-color1">学历：</div>
              <div class="ta-l f-l w-sty1-color2">{{ education }}</div>
            </div>
            <div class="w-sty1 clearfix">
              <div class="ta-r f-l w-sty1-color1">固定电话：</div>
              <div class="ta-l f-l w-sty1-color2">{{ fixedTelephone }}</div>
            </div>
            <div class="w-sty1 clearfix">
              <div class="ta-l f-l w-sty1-color1">邮箱：</div>
              <div class="ta-l f-l w-sty1-color2">{{ mailbox }}</div>
            </div>
            <div class="w-sty1 clearfix">
              <div class="ta-l f-l w-sty1-color1">其他电话：</div>
              <div class="ta-l f-l w-sty1-color2">{{ otherPhone }}</div>
            </div>
            <div class="w-sty1 clearfix">
              <div class="ta-l f-l w-sty1-color1">通讯地址：</div>
              <div class="ta-l f-l w-sty1-color2">{{ postalAddress }}</div>
            </div>
            <div class="w-sty1 clearfix">
              <div class="ta-l f-l w-sty1-color1">证件类型：</div>
              <div class="ta-l f-l w-sty1-color2">{{ certificateType }}</div>
            </div>
            <div class="w-sty1 clearfix">
              <div class="ta-l f-l w-sty1-color1">身份证号：</div>
              <div class="ta-l f-l w-sty1-color2">{{ pinCodes }}</div>
            </div>
            <div class="w-sty1 clearfix">
              <div class="ta-l f-l w-sty1-color1">民族：</div>
              <div class="ta-l f-l w-sty1-color2">{{ Nation }}</div>
            </div>
            <div class="w-sty1 clearfix">
              <div class="ta-l f-l w-sty1-color1">发证机关：</div>
              <div class="ta-l f-l w-sty1-color2">{{ issuingAuthority }}</div>
            </div>
            <div class="w-sty1 clearfix">
              <div class="ta-l f-l w-sty1-color1">有效期：</div>
              <div class="ta-l f-l w-sty1-color2">{{ term }}</div>
            </div>
            <div class="w-sty1 clearfix">
              <div class="ta-l f-l w-sty1-color1">居住地址：</div>
              <div class="ta-l f-l w-sty1-color2">{{ residentialAddress }}</div>
            </div>
            <div class="flex w-sty2 pt-10 pb-10">
              <p class="align-self-start">证件照片：</p>
              <img :src=" idPhoto " alt="" srcset="" class="ml-10">
              <img :src=" idPhoto2 " alt="" srcset="" class="ml-10">
            </div>
          </div>

          <div class="f-14 pl-20 pr-20 pb-20">微信结算账户：XXXXX  显示最近30天内交易记录<button type="button" class="ivu-btn-default ivu-btn ml-10">查看全部</button>

          </div>

          <Table stripe :columns="columns1" :data="data1"></Table>

        </TabPane>
        <TabPane label="证件信息" name="name2">证件信息</TabPane>
        <TabPane label="资质证书" name="name3">资质证书</TabPane>
        <TabPane label="技能信息" name="name4">技能信息</TabPane>
        <TabPane label="获奖证书" name="name5">获奖证书</TabPane>
        <TabPane label="结算账户信息" name="name6">结算账户信息</TabPane>
        <TabPane label="培训记录" name="name7">培训记录</TabPane>
        <TabPane label="信用记录" name="name8">信用记录</TabPane>
        <TabPane label="状态变更记录" name="name9">状态变更记录</TabPane>
    </Tabs>




  </div>
</template>

<script>
  export default {
    // 名称
    name: 'ViewEngineerInformation',
    // 数据(初始/静态/待填充)
    data() {
      return {
        state: '上岗',
        fullName: '王超',
        moblie: 13910001000,
        serial: 80048733,
        serviceStar: '三星级',
        gender: '男',
        dateOfBirth: '1992/05/11',
        age: 25,
        creationDate: '2017/05/12 11:22:33',
        updateDate: '2017/07/22 11:22:33',
        education: '大专',
        fixedTelephone: '0816-5667989',
        mailbox: 'XXXXX@qq.com',
        otherPhone: '无',
        postalAddress: '四川省绵阳市涪城区XXXXXXX',
        certificateType: '身份证',
        pinCodes: 'XXXXXXXXXXXXXXXXXX',
        Nation: '汉族',
        issuingAuthority: 'XX市公安局',
        term: 'XXXX年X月X日 至 XXXX年X月X日',
        residentialAddress: 'XX省XX市XXXXXXXXXX',
        idPhoto: require('../../assets/photo2.png'),
        idPhoto2: require('../../assets/photo2.png'),
        idPhoto3: require('../../assets/photo.png'),
        columns1: [
          {
            type: 'index',
            width: 100,
            align: 'center'
          },
          {
            title: '资质类型',
            key: 'qualificationType',
            align: 'center'
          },
          {
            title: '证书编号',
            key: 'certificateNumber',
            align: 'center'
          },
          {
            title: '审核状态',
            key: 'auditStatus',
            align: 'center'
          },
          {
            title: '审核日期',
            key: 'auditDate',
            align: 'center'
          },
          {
            title: '审核说明',
            key: 'auditInstructions',
            align: 'center'
          },
          {
            title: '更新时间',
            key: 'updateTime',
            align: 'center'
          },
          {
            title: '有效期',
            key: 'termOfValidity',
            align: 'center'
          }
        ],
        data1: [
          {
            qualificationType: 'XXX',
            certificateNumber: 2333253454,
            auditStatus: '待审核',
            auditDate: '',
            auditInstructions: '',
            updateTime: '2017/06/29 11:22:33',
            termOfValidity: '',
            cellClassName: {
                auditStatus: 'color-org'
            }
          },
          {
            qualificationType: "XXX",
            certificateNumber: 4345345345,
            auditStatus: '审核通过',
            auditDate: '2017/07/21 11:22:33',
            auditInstructions: 'XXXXXXXX',
            updateTime: '2017/07/20 11:22:33',
            termOfValidity: '长期有效 (无到期时间)',
            cellClassName: {
                auditStatus: 'color-ligth-blue'
            }
          }
        ]
      }
    },
    // 钩子(创建执行)
    created() {
    },
    // 方法
    methods: {

    }
  }
</script>
<style lang="scss">
  @import "../../styles/base";

</style>

