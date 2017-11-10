/**
 * 组件配置保存到本地
 */
export default {
    /**
     * localstorage表格列配置数据结构
     * {
     *   table001: ['selection', 'name', 'type']
     * }
     */
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
}
