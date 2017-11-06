<template>
  <li :class="classes" @click="handerClick">
    <slot></slot>
  </li>
</template>
<script>
  import Emitter from '@/mixins/emitter';
  import router from '@/router';
  const prefixCls = 'ivu-menu';

  export default {
    name: 'TopMenuItem',
    mixins: [Emitter],
    props: {
      name: {
        type: [String, Number]
      },
      disabled: {
        type: Boolean,
        default: false
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
      handerClick(){
        this.$emit('click')
      }
    }
  };
</script>
