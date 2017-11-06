<template>
  <li :class="classes"
      @click.stop="handleClick"
      :mbx="mbx"
      :mname="name">
    <slot></slot>
  </li>
</template>
<script>
  import Emitter from '@/mixins/emitter';
  import router from '@/router';
  const prefixCls = 'ivu-menu';

  export default {
    name: 'MenuItem',
    mixins: [Emitter],
    props: {
      name: {
        type: [String, Number],
        required: true
      },
      disabled: {
        type: Boolean,
        default: false
      },
      mbx: {},
      link: {
        type: [String],
        require: true
      }
    },
    data() {
      return {
        active: false
      };
    },
    computed: {
      classes() {
        return [
          `${prefixCls}-item`,
          {
            [`${prefixCls}-item-active`]: this.active,
            [`${prefixCls}-item-selected`]: this.active,
            [`${prefixCls}-item-disabled`]: this.disabled
          }
        ];
      }
    },
    methods: {
      handleClick($event) {
        if (this.disabled) return;

        let parent = this.$parent;
        let name = parent.$options.name;
        while (parent && (!name || name !== 'Submenu')) {
          parent = parent.$parent;
          if (parent) name = parent.$options.name;
        }

        if (parent) {
          this.dispatch('Submenu', 'on-menu-item-select', this.name);
        } else {
          this.dispatch('Menu', 'on-menu-item-select', this.name);
        }

        let el = $event.target;
        if (el) {
          let width = el.offsetWidth;
          if (width < 240) {
            let res = 240 - width;
            el.style.marginLeft = "-" + res + "px";
            el.style.paddingLeft = (43 + res) + "px";
          }
        }
        router.replace({path: this.link});
        console.log(this.name,1212)
        common.sendEvent('link-change', this.mbx);
        common.sendEvent('on-update-active-name', this.name);
      }
    },
    mounted() {
      common.addEvent('on-update-active-name', (name) => {
        if (this.name === name) {
          this.active = true;
          this.dispatch('Submenu', 'on-update-active-name', true);
        } else {
          this.active = false;
        }
      });
      this.$on('on-update-active-name', (name) => {
        if (this.name === name) {
          this.active = true;
          this.dispatch('Submenu', 'on-update-active-name', true);
        } else {
          this.active = false;
        }
      });
    }
  };
</script>
