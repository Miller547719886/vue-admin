export default {
  checkIsLogin() {
    const USER = common.getStorage($CONST.USER_KEY)
    return USER == null ? false : true
  },
  setUserInfo(user) {
    common.setStorage($CONST.USER_KEY, user)
  },
  getUserInfo() {
    return common.getStorage($CONST.USER_KEY);
  },
  logout() {
    common.rmStorage($CONST.USER_KEY)
    common.rmStorage($CONST.TOKEN_KEY)
    configUtils.clearColumnsKey()
  },
  getToken() {
    return common.getStorage($CONST.TOKEN_KEY)
  },
  setToken(token) {
    common.setStorage($CONST.TOKEN_KEY, token)
  }
}
