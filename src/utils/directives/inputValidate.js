import Vue from 'vue';

const inputValidate = function(name, regExp) {
    Vue.directive(name, {
        bind: function(el) {
            el.handler = function(e) {
                let input = el.tagName === 'INPUT' ?
                    el :
                    el.getElementsByTagName('input')[0]
                input.value = input.value.replace(regExp, '') // 忽略数字与字母以外的字符
            }
            el.addEventListener('input', el.handler, true)
        },
        unbind: function(el) {
            let input = el.tagName === 'INPUT' ?
                el :
                el.getElementsByTagName('input')[0]
            el.removeEventListener('input', el.handler, true)
        }
    })
}

/* 数字统一指代正整数 */


/**
 * @function 表单元素限制输入类型(数字与字母)
 * @directive: v-number-letter-only
 * @application: iview组件Input
 * @BusinessScenarios 密码
 */

const inputNumberLetterOnly = inputValidate('number-letter-only', /[^0-9a-zA-Z]+/) // 只允许数字或字母

/**
 * @function 表单元素限制输入类型(数字)
 * @directive: v-number-only
 * @application: iview组件Input
 * @BusinessScenarios 页数
 */
const inputNumberOnly = inputValidate('number-only', /[^0-9]+/) // 只允许数字

/**
 * @function 表单元素限制输入类型(数字|字母|汉字)
 * @directive: v-number-letter-chinese-only
 * @application: iview组件Input
 * @BusinessScenarios 密码
 */
const inputNumberLetterChineseOnly = inputValidate('number-letter-chinese-only', /[^A-Za-z0-9\u4e00-\u9fa5]+/)

/**
 * @function 表单元素限制输入类型(数字|字母|特殊符号)
 * @directive: v-number-letter-symbol-only
 * @application: iview组件Input
 * @BusinessScenarios 密码
 */
const inputNumberLetterSymbolOnly = inputValidate('number-letter-symbol-only', /[^a-zA-Z0-9:',!();\.\?\-\+，。；：‘’（）！？]+/)

/**
 * @function 表单元素限制输入类型(数字|字母|特殊符号|汉字)
 * @directive: v-number-letter-chinese-symbol-only
 * @application: iview组件Input
 * @BusinessScenarios 用户名等名称
 */
const inputNumberLetterChineseSymbolOnly = inputValidate('number-letter-chinese-symbol-only', /[^a-zA-Z0-9:',!();\.\?\-\+，。；：‘’（）！？\u4e00-\u9fa5]+/)

// 正则中需要转义的字符:* . ? - + $ ^ [ ] ( ) { } | \ /
export { inputNumberLetterOnly, inputNumberOnly, inputNumberLetterChineseOnly, inputNumberLetterSymbolOnly, inputNumberLetterChineseSymbolOnly }