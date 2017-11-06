<template>
  <div>
    <Row style="padding:20px">
        <Col style="width:100%" span="11">
            <Card class="accountFtBox" :bordered="false">
                <p slot="title">账户信息</p>
                <p>
                  <span>账户类型：</span>
                  <span>{{ data.accountType }}</span>
                </p>
                <p>
                  <span>编号：</span>
                  <span>{{ data.number }}</span>
                </p>
                <p>
                  <span>名称：</span>
                  <span>{{ data.companyName }}</span>
                </p>
                <p>
                  <span>地址：</span>
                  <span>{{ data.address }}</span>
                </p>
                <p>
                  <span>联系电话：</span>
                  <span>{{ data.telephone }}</span>
                </p>
                <p>
                  <span>手机：</span>
                  <span>{{ data.phone }}</span>
                </p>
                <p>
                  <span>传真：</span>
                  <span>{{ data.fax }}</span>
                </p>
                <p>
                  <span>联系人：</span>
                  <span>{{ data.contacts }}</span>
                </p>
                <p>
                  <span>邮编：</span>
                  <span>{{ data.zipCode }}</span>
                </p>
            </Card>
        </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    name: 'AccountInfo',
    data() {
      return {
        data: {
          accountType: '',
          number: '',
          companyName: '',
          address: '',
          telephone: '',
          phone: '',
          fax: '',
          contacts: '',
          zipCode: ''
        }
      }
    },
    created() {
      this.$http.get(`/user/engineer/findEngineerById?id=4`).then(({data}) => {
        if (data.code == $HTTP.SUCCESS) {
          let info = data.data
          // this.data.accountType = info
          this.data.number = info.createUser || '暂无'
          // this.data.companyName = info
          this.data.address =
          info.province +
          info.city +
          info.district +
          info.street +
          info.detailedAddress || '暂无'
          this.data.telephone = info.telephone || '暂无'
          this.data.phone = info.phone || '暂无'
          this.data.fax = info.fax || '暂无'
          this.data.contacts = info.contacts || '暂无'
          this.data.zipCode = info.zipCode || '暂无'
        }
      })
    },
    methods: {
    }
  }
</script>

<style>
  .accountFtBox p span:first-child{
    text-align: right;
    display: inline-block;
    width: 5em;
  }
  .cont-gray {
    color: gray;
  }
</style>
