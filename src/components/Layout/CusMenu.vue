<style scoped>
  .bg_none {
    background: none !important;
  }
  #app .ivu-menu-submenu.ivu-menu-opened > .ivu-menu-submenu-title{
    color: #333;
  }
  .ivu-menu-item.ivu-menu-item-active{
    color: #ff8a00 !important;
  }
</style>
<template>
  <li :class="classes"
      @mouseenter="handleMouseenter"
      @mouseleave="handleMouseleave">
    <div :class="[prefixCls + '-submenu-title']"
         ref="reference"
         @click="handleClick"
         v-if="isParent"
         class="bg_none">
      <slot name="title"></slot>
      <Icon type="ios-arrow-down"
            :class="[prefixCls + '-submenu-title-icon']"></Icon>
    </div>
    <div :class="[prefixCls + '-submenu-title']"
         ref="reference"
         @click="handleClick"
         v-else>
      <slot name="title"></slot>
      <Icon type="ios-arrow-down"
            :class="[prefixCls + '-submenu-title-icon']"></Icon>
    </div>
    <ul :class="[prefixCls]"
        v-if="mode === 'vertical'"
        v-show="opened">
      <slot></slot>
    </ul>
    <transition name="slide-up"
                v-else>
      <Drop v-show="opened"
            placement="bottom"
            ref="drop"
            :style="dropStyle">
        <slot></slot>
      </Drop>
    </transition>
  </li>
</template>
<script>
  import {getStyle, findComponentUpward} from '@/iviewutils/assist';
  import Emitter from '@/mixins/emitter';
  const prefixCls = 'ivu-menu';

  export default {
    name: 'CusMenu',
    props: {
      name: {
        type: [String, Number],
        required: true
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        prefixCls: prefixCls,
        active: false,
        opened: false,
        dropWidth: parseFloat(getStyle(this.$el, 'width')),
        parent: findComponentUpward(this, 'Menu'),
        isParent: false
      };
    },
    computed: {
      classes() {
        return [
          `${prefixCls}-submenu`,
          {
            [`${prefixCls}-item-active`]: this.active,
            [`${prefixCls}-opened`]: this.opened,
            [`${prefixCls}-submenu-disabled`]: this.disabled
          }
        ];
      },
      mode() {
        return this.parent.mode;
      },
      accordion() {
        return this.parent.accordion;
      },
      dropStyle() {
        let style = {};

        if (this.dropWidth) style.minWidth = `${this.dropWidth}px`;
        return style;
      }
    },
    methods: {
      handleMouseenter() {
        if (this.disabled) return;
        if (this.mode === 'vertical') return;

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.parent.updateOpenKeys(this.name);
          this.opened = true;
        }, 250);
      },
      handleMouseleave() {
        if (this.disabled) return;
        if (this.mode === 'vertical') return;

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.parent.updateOpenKeys(this.name);
          this.opened = false;
        }, 150);
      },
      handleClick($event) {
        if (this.disabled) return;
        if (this.mode === 'horizontal') return;
        const opened = this.opened;
        if (this.accordion) {
          this.parent.$children.forEach(item => {
            if (item.$options.name === 'Submenu') item.opened = false;
          });
        }
        this.opened = !opened;
        this.parent.updateOpenKeys(this.name);
        let el = $event.target;
        let i;
        if (el.classList.contains('bg_none')) {
          i = el.querySelector('i:last-child');

        } else if (el.tagName == "i" || el.tagName == "I") {
          if (el.parentNode.classList.contains('bg_none')) {
            i = el;
          }
        }
        if (i) {
          let tf = i.style.webkitTransform ||
            i.style.MozTransform ||
            i.style.msTransform ||
            i.style.OTransform ||
            i.style.transform;
          if (tf === 'rotate(0deg)') {
            i.style['transform'] = 'rotate(180deg)';
            i.style['webkitTransform'] = 'rotate(180deg)';
            i.style['MozTransform'] = 'rotate(180deg)';
            i.style['msTransform'] = 'rotate(180deg)';
            i.style['OTransform'] = 'rotate(180deg)';
          } else {
            i.style['transform'] = 'rotate(0deg)';
            i.style['webkitTransform'] = 'rotate(0deg)';
            i.style['MozTransform'] = 'rotate(0deg)';
            i.style['msTransform'] = 'rotate(0deg)';
            i.style['OTransform'] = 'rotate(0deg)';
          }
        }
      }
    },
    watch: {
      mode(val) {
        if (val === 'horizontal') {
          this.$refs.drop.update();
        }
      },
      opened(val) {
        if (this.mode === 'vertical') return;
        if (val) {
          // set drop a width to fixed when menu has fixed position
          this.dropWidth = parseFloat(getStyle(this.$el, 'width'));
          this.$refs.drop.update();
        } else {
          this.$refs.drop.destroy();
        }
      }
    },
    mounted() {
      let $parent = this.$parent;
      let isFirst = !$parent.isFirst;
      if (isFirst) {
        let i = this.$el.querySelector('i:last-child');
        i.style['transform'] = 'rotate(0deg)';
        i.style['webkitTransform'] = 'rotate(0deg)';
        i.style['MozTransform'] = 'rotate(0deg)';
        i.style['msTransform'] = 'rotate(0deg)';
        i.style['OTransform'] = 'rotate(0deg)';
        this.isParent = true;
      }


      this.$on('on-menu-item-select', (name) => {
        if (this.mode === 'horizontal') this.opened = false;
        this.dispatch('Menu', 'on-menu-item-select', name);
        return true;
      });
      this.$on('on-update-active-name', (status) => {
        this.active = status;
      });
    }
  };
</script>
