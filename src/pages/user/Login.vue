<template>
  <div @keydown.enter="keyLogin" class="parent">
    <Modal v-model="modal"
           width="360"
           class-name="login-vertical-center-modal">
      <p slot="header"
         style="color:red;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>警告提示</span>
      </p>
      <div style="text-align:center">
        <p>{{message}}</p>
      </div>
      <div slot="footer">
        <Button type="error"
                long
                @click="hideModal">确认
        </Button>
      </div>
    </Modal>
    <div class="loginForm-outer" style="z-index: 2;position: relative">
      <div class="loginForm-outer-title"></div>
      <div class="loginForm">
        <Spin size="large"
              fix
              v-if="loginSpin"
              class="login_loading_spin">
          <Icon type="load-c"
                size="18"
                class="login-spin-icon-load"></Icon>
          <div>正在登录中...</div>
        </Spin>
        <Form ref="loginForm"
              :model="formInline"
              :rules="ruleInline">
          <Form-item class="loginFormName">
            <!-- <h1>用户登录</h1> -->
          </Form-item>
          <Form-item prop="username">
            <Input type="text"
                  v-model="formInline.username"
                  placeholder="请输入用户名"
                  :maxlength="20"
                  @on-change="delSpace(formInline.username, true)"
                  v-number-letter-chinese-only>
            <Icon type="person"
                  slot="prepend"
                  class="login_icon_size"></Icon>
            </Input>
          </Form-item>
          <Form-item prop="password">
            <Input type="password"
                  pattern="[0-9a-zA-z]*"
                  v-model="formInline.password"
                  placeholder="请输入密码"
                  :maxlength="20"
                   @on-change="delSpace(formInline.password, false)"
                  v-number-letter-symbol-only>
            <Icon type="locked"
                  slot="prepend"
                  class="login_icon_size"></Icon>
            </Input>
          </Form-item>
          <Form-item class="loginFormButton">
            <Button type="info" class="btn-login"
                    @click="handleSubmit"
                    long>登录
            </Button>
          </Form-item>
          <Form-item class="f-r">
            <a class="forget-pw f-14">忘记密码?</a>
          </Form-item>
        </Form>
      </div>
    </div>
    <div class="waves" style="z-index: 1">
      <div class="wave wave1"></div>
      <div class="wave wave2"></div>
      <div class="wave wave3"></div>
      <div class="wave wave4"></div>
    </div>
  </div>
</template>
<script>
  import router from '@/router'
  export default {
    name: 'Login',
    data() {
      return {
        loginSpin: false,
        formInline: {
          username: '',
          password: ''
        },
        ruleInline: {
          username: [
            {required: true, message: '请填写用户名', trigger: 'blur'},
            {type: 'string', min: 1, max: 20, message: '用户名不能小于1位或大于20位', trigger: 'blur'},
            /* {pattern: /^[0-9]*$/, message: '用户名只能由数字组成', trigger: 'blur'} */
          ],
          password: [
            {required: true, message: '请填写密码', trigger: 'blur'},
            {type: 'string', min: 6, max: 20, message: '密码长度不能小于6位或大于20位', trigger: 'blur'}
          ]
        },
        message: '',
        modal: false
      }
    },
    // directives: {
    //     numberLetterOnly: {
    //         bind: function(el) {
    //             let input = el.querySelector('input')
    //             el.handler = function () {
    //                 input.value = input.value.replace(/[^0-9a-zA-Z]+/, '')
    //             }
    //             input.addEventListener('input', el.handler)
    //         },
    //         unbind: function(el) {
    //             let input = el.querySelector('input')
    //             input.removeEventListener('input', el.handler)
    //         }
    //     }
    // },
    created() {
      common.sendEvent('setFull', true)
      if (loginUtils.checkIsLogin()) {
        this.toIndex()
      }
    },

    methods: {
      delSpace (val, flag) {
        flag ?
        this.formInline.username = val.replace(/\s/g, '') :
        this.formInline.password = val.replace(/\s/g, '')
      },
      keyLogin () {
        // enter键登陆
        this.handleSubmit()
      },
      toIndex() {
        router.replace({path: "/Index"})
      },
      hideModal() {
        this.modal = false
      },
      checkFormValidate (formValidate) {
        console.log(formValidate)
        let userName = formValidate.username
        let isAdmin = !!(userName === 'admin')
        let isNormalUser = common.checkNumber(userName)
        console.log(isNormalUser, 'is')
        if (isAdmin || isNormalUser) {
          return true
        } else {
          return false
        }
      },
      handleSubmit() {
        let that = this;
        let isUser = this.checkFormValidate(this.formInline)
        if (!isUser) {
          this.$Message.error('请检查用户名是否符合规范!')
          return
        }
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.loginSpin = true;
            this.$http.post('/user/login', this.formInline).then(({data}) => {
              this.loginSpin = false;
              if (data.code == $HTTP.SUCCESS) {
                let user = data.data
                loginUtils.setUserInfo(user) // 保存到本地
                that.toIndex()
                common.sendEvent('setFull', false)
                this.$Notice.success({
                  title: '成功提示',
                  desc: `${user.name}登录成功`
                })
              } else if (data.code == $HTTP.FAIL) {
                this.modal = true
                this.message = data.message
              }
            })
          } else {
            this.$Message.error('请检查用户名和密码是否输入正确!')
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  @import "../../styles/base";
  .parent {
    // display: flex;
    // align-items: center;
    // /*垂直居中*/
    // justify-content: center;
    /*水平居中*/
    position: relative;
    padding-top: 5%;
    width: 100%;
    height: 100%;
    @include gradient(#0096b4, #00587f);
  }

  .loginForm-outer {
    margin: 0 auto;
    width: 520px;
    padding: 13px 24px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, .28);
    box-shadow: 0px 0px 20px rgba(255, 255, 255, 1);

    .loginForm-outer-title {
      width: 504px;
      height: 194px;
      @include backImg('../../assets/login_title.png');
      position: relative;
      left: -16px;
    }
  }

  .waves {
    position: absolute;
    overflow: hidden;
    width: 100%;
    height: 231px;
    bottom: 0;
    left: 0;
    .wave{
      position: absolute;
      width: 100%;
      height: 231px;
      background-image: url('../../assets/wave.png');
      background-repeat: repeat-x;
      z-index: 1;
      left: 0px;
    }
    .wave1 {
			bottom: 0px;
			background-position: 1918px 0;
    }
    .wave2 {
			bottom: -30px;
			background-position: 1918px 0;
    }
    .wave3 {
			bottom: 0px;
			background-position: 0 0;
    }
    .wave4 {
			bottom: -30px;
			background-position: 0 0;
    }
    .wave1,
		.wave2{
			animation: myfirst 25s linear 0s infinite normal;
		}
		.wave3,
		.wave4 {
			animation: myfirst2 25s linear 0s infinite normal;
    }
  }
  @keyframes myfirst {
    0% {
      background-position: 1918px 0;
    }
    25% {
      background-position: 2877px 0;
    }
    50% {
      background-position: 3836px 0;
    }
    75% {
      background-position: 4795px 0;
    }
    100% {
      background-position: 5754px 0;
    }
  }
  @keyframes myfirst2 {
    0% {
      background-position: 0 0;
    }
    25% {
      background-position: 959px 0;
    }
    50% {
      background-position: 1918px 0;
    }
    75% {
      background-position: 2877px 0;
    }
    100% {
      background-position: 3836px 0;
    }
  }

  .forget-pw {
    color: #005178;
    text-decoration: underline;

    &:hover {
      color: #005178;
      text-decoration: underline;
    }
  }

  .btn-login {
    margin-top: 40px;
    color: #fff!important;
    border: 1px solid #00354e!important;
    border-radius: 8px!important;
    height: 44px!important;
    font-size: 16px!important;
    box-shadow: inset 0 0 6px rgba(255, 255, 255, .6);
    background-color: #005178!important;
  }

  .loginForm {
    margin-top: -17px;
    // width: 400px;
    height: 385px;
    background-color: white;
    // border-radius: 5px;
    padding: 0 20px;
    transition: all 0.3s ease;
    padding-top: 20px;
    position: relative;
  }

  .loginForm > form {
    width: 300px;
    margin: 0 auto;
  }

  .loginForm h3 {
    text-align: left;
  }

  @media screen and (max-width: 320px) {
    .loginForm {
      width: 300px;
    }
  }

  .loginFormButton {
    margin-bottom: 0px !important;
  }

  .loginFormName {
    margin-bottom: 20px;
  }

  .login_icon_size {
    font-size: 16px;
  }

  .login-vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .login-vertical-center-modal .ivu-modal {
    top: 0;
  }

  .login_loading_spin {
    border-radius: 5px;
    opacity: 0.6;
  }

  .login-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }

  @keyframes ani-demo-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
