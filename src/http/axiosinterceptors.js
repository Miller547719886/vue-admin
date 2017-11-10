import router from '@/router'
import store from '@/store'
export default {
  init(axios, iView) {
    //请求拦截器 如果有token则给所有请求设置token请求头
    axios.interceptors.request.use(config => {
      iView.LoadingBar.start();
      let token = loginUtils.getToken();
      if (token != null) {
        config.headers[$CONST.TOKEN_KEY] = token;
      }
      return config;
    }, err => {
      iView.LoadingBar.error();
      return Promise.reject(err);
    });
    //返回拦截器，监听token变化
    axios.interceptors.response.use(response => {
      iView.LoadingBar.finish();
      $BASE.EXCLUDE_NOTICE_URL.forEach(function (i) {
        const url = $BASE.URL + i;
        if (response.config.url != url) {
          let data = response.data;
          if (data && data.code == $HTTP.FAIL) {
            if (data.message) {
              iView.Notice.error({
                title: '警告提示',
                desc: store.getters.message ?
                      `您选择的工程师不能做当前操作，请重新选择！` :
                      `${data.message}`
              })
              store.dispatch('setMessage', false)
            } else {
              iView.Notice.error({
                title: '警告提示',
                desc: `操作失败`
              })
            }
          }
        }
      });
      let token = response.headers['x-auth-token']
      if (token) {
        loginUtils.setToken(token)
      }
      return response;
    }, error => {
      iView.LoadingBar.error();
      if (error.response) {
        let data = error.response.data;
        switch (error.response.status) {
          case 401:
            // 返回 401 清除token信息并跳转到登录页面
            if (loginUtils.checkIsLogin()) {
              loginUtils.logout();
              if (data && data.message) {
                iView.Notice.error({
                  title: '警告提示',
                  desc: `${data.message}`
                })
              }
            }
            router.replace({
              path: '/Login'
            })
            break
          case 403:
          case 500:
            if (data && data.message) {
              iView.Notice.error({
                title: '警告提示',
                desc: `${data.message}`
              })
            }
            break
          default:
            iView.Notice.error({
              title: '警告提示',
              desc: `连接服务器异常`
            })
        }
      }
      return Promise.reject(error.response.data) // 返回接口返回的错误信息
    });
  }
}
