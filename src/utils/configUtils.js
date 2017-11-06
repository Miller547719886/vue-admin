/**
 * 组件配置保存到本地
 * {
 *   table001: ['selection', 'name', 'type']
 * }
 */
export default {
    getColumnsKey(tableId) {
        const USER = common.getStorage($CONST.CONFIG_COLUMNS_KEY)
        if (USER == null) {
            return 0 // 没有本地存储
        } else if (USER[tableId] == null) {
            return 1 // 有本地存储但没有当前表格配置
        } else {
            return USER[tableId] // 有本地存储且有当前表格配置
        }
    },
    setColumnsKey(columnsConfigObj) {
        common.setStorage($CONST.CONFIG_COLUMNS_KEY, columnsConfigObj)
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