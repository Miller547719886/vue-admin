<template>
  <div class="transfer">
    <Transfer class="d-ib" ref="Transfer"
      @on-change="onChange"
      :render-format="render"
      :data="data"
      :titles="titles"
      :target-keys="targetKeys"
      :operations="['向左移动','向右移动']"
      :list-style="listStyle"
      :selected-keys="selectedKeys">
    </Transfer>
    <div class="d-ib ml-10" style="position: relative; top: 20px">
      <Button class="d-b" @click="goUp">上移</Button>
      <Button class="d-b mt-10" @click="goDown">下移</Button>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'CTransfer',
    props: {
      data: {
        type: Array,
        required: true,
        default: () => {
          return [
            { "key": "1", "label": "内容1", "disabled": false },
            { "key": "2", "label": "内容2", "disabled": false },
            { "key": "3", "label": "内容3", "disabled": false }
          ]
        }
      },
      targetKeys: {
        type: Array,
        required: false,
        default: () => {
          return []
        }
      },
      titles: {
        type: Array,
        required: false,
        default: () => {
          return ['源列表', '目的列表']
        }
      }
    },
    data () {
      return {
        listStyle: {
            width: '250px',
            height: '300px'
        },
        selectedKeys: [], // 哪些项应该被选中
        label: '',
        selectedIndex: null,
        itemClassName: 'ivu-transfer-list-content-item'
      }
    },
    mounted () {
      let vm = this.$refs['Transfer']
      let el = vm.$el
      let switchListUl = el.querySelectorAll('.ivu-transfer-list')[1].querySelector('.ivu-transfer-list-content')
      let _this = this
      switchListUl.addEventListener('click', function(e) {
        let target = e.target
        if (dom.hasClass(target, _this.itemClassName)) {
          if (dom.hasClass(target, 'active')) { // 处于点击状态
            dom.removeClass(target, 'active')
            _this.label = ''
            _this.clearSelectedIndex()
          } else { // 不处于点击状态
            dom.addClass(target, 'active')
            _this.label = dom.getInnerText(target.getElementsByTagName('span')[0])
            let siblings = dom.siblings(target).filter((item) => {
              return dom.hasClass(item, _this.itemClassName)
            })
            for (let el of siblings) {
              dom.removeClass(el, 'active')
            }
            _this.getSelectedIndex(target)
          }
        }
      })
    },
    methods: {
      render (item) {
        return /* item.key + ':' +  */item.label;
      },
      onChange (newTargetKeys) {
        this.targetKeys = newTargetKeys;
      },
      getSelectedItem () {
        let vm = this.$refs['Transfer']
        let el = vm.$el
        let switchList = el.querySelectorAll('.ivu-transfer-list')[1].querySelectorAll('.ivu-transfer-list-content .ivu-transfer-list-content-item')
        let selectedItem = this.selectedIndex != null ? switchList[this.selectedIndex] : null
        return { switchList, selectedItem }
      },
      goUp () {
        if (this.selectedIndex == null) { return false }
        let switchList = this.getSelectedItem().switchList
        let selectedItem = this.getSelectedItem().selectedItem
        if (Array.from(switchList).indexOf(selectedItem) !== 0) {
          dom.before(selectedItem, switchList[this.selectedIndex - 1])
          this.selectedIndex -= 1
        }
      },
      goDown () {
        if (this.selectedIndex == null) { return false }
        let switchList = this.getSelectedItem().switchList
        let selectedItem = this.getSelectedItem().selectedItem
        if (Array.from(switchList).indexOf(selectedItem) !== switchList.length - 1) {
          dom.after(selectedItem, switchList[this.selectedIndex + 1])
          this.selectedIndex += 1
        }
      },
      getSelectedIndex (el) {
        this.selectedIndex = Array.from(el.parentNode.children).indexOf(el)
      },
      clearSelectedIndex () {
        this.selectedIndex = null
      }
    },
    watch: {

    },
    computed: {

    }
  }
</script>
<style>
  .ivu-transfer-list-content-item.active {
    background: #f3f3f3;
  }
</style>
