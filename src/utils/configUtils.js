/**
 * 组件配置保存到本地
 * {
 *   table001: ['selection', 'name', 'type']
 * }
 */
export default {
    getColumnsKey(tableId) {
        const config = common.getStorage($CONST.CONFIG_COLUMNS_KEY)
        if (tableId != undefined) {
          return (config ? config[tableId] : undefined) // 获取对应id的配置
        } else {
          return config // 获取所有配置
        }
    },
    setColumnsKey(columnsConfigObj) {
        common.setStorage($CONST.CONFIG_COLUMNS_KEY, columnsConfigObj)
        console.log(common.getStorage($CONST.CONFIG_COLUMNS_KEY), 'saved config')
    },
    clearColumnsKey () {
      common.rmStorage($CONST.CONFIG_COLUMNS_KEY)
    }
    // logout() {
    //     common.rmStorage($CONST.CONFIG_COLUMNS_KEY)
    //     common.rmStorage($CONST.TOKEN_KEY)
    // },
    // getToken() {
    //     return common.getStorage($CONST.TOKEN_KEY)
    // },
    // setToken(token) {
    //     common.setStorage($CONST.TOKEN_KEY, token)
    // }
}
