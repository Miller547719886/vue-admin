import common from './common'
import dom from './dom'
import loginUtils from './loginUtils'
import configUtils from './configUtils'
export default () => {
    window.common = common
    window.dom = dom
    window.loginUtils = loginUtils
    window.configUtils = configUtils
    window.$BASE = {
        // URL: 'http://39.108.37.119:443',
        URL: 'https://isr-dev.kydls.cn',
        // URL: 'http://192.168.10.119:443',
        EXCLUDE_NOTICE_URL: ['/user/login']
    }
    window.$CONST = {
        USER_KEY: 'USER_KEY',
        TOKEN_KEY: 'X-Auth-Token',
        CONFIG_COLUMNS_KEY: 'CONFIG_COLUMNS_KEY'
    }
    window.$HTTP = {
        SUCCESS: 0,
        FAIL: 999
    }
    window.DList = {
        Attribute: {
            NO: 0,
            YES: 1
        },
        Organization: {
            SYSTEM: 'SYSTEM',
            SERVICE: 'SERVICE',
            AREACENTER: 'AREACENTER',
            MLSALESCOMPANY: 'MLSALESCOMPANY'
        }
    }
}
