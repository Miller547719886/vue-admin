<template>
  <div :class="classes"
       ref="cell">
    <template v-if="renderType === 'index'">{{naturalIndex + 1}}</template>
    <template v-if="renderType === 'normal'"><span v-html="row[column.key]"></span></template>
  </div>
</template>
<script>
  import Vue from 'vue';

  export default {
    name: 'TreeTableCell',
    props: {
      prefixCls: String,
      row: Object,
      column: Object,
      index: Number,
      context: {
        type: Object,
      }
    },
    data() {
      return {
        renderType: '',
        uid: -1,
      };
    },
    computed: {
      classes() {
        return [
          `${this.prefixCls}-cell`,
          {
            [`${this.prefixCls}-hidden`]: !this.fixed && this.column.fixed && (this.column.fixed === 'left' || this.column.fixed === 'right'),
            [`${this.prefixCls}-cell-ellipsis`]: this.column.ellipsis || false
          }
        ];
      }
    },
    methods: {
      compile() {
        if (this.column.render) {
          const $parent = this.context == null ? this.$parent.$parent : this.context;
          const template = this.column.render(this.row, this.column, this.index);
          const cell = document.createElement('div');
          cell.innerHTML = template;
          this.$el.innerHTML = '';
          let methods = {};
          Object.keys($parent).forEach(key => {
            const func = $parent[key];
            if (typeof (func) === 'function' && (func.name === 'boundFn' || func.name === 'n')) {
              methods[key] = func;
            }
          });
          const res = Vue.compile(cell.outerHTML);
          // todo 临时解决方案
          const component = new Vue({
            render: res.render,
            staticRenderFns: res.staticRenderFns,
            methods: methods,
            data() {
              return $parent._data;
            }
          });

          const Cell = component.$mount();
          this.$refs.cell.appendChild(Cell.$el);
        }
      },
      destroy() {

      },
      toggleSelect() {
        this.$parent.$parent.toggleSelect(this.index);
      }
    },
    created() {
      if (this.column.type === 'index') {
        this.renderType = 'index';
      } else if (this.column.type === 'selection') {
        this.renderType = 'selection';
      } else if (this.column.render) {
        this.renderType = 'render';
      } else {
        this.renderType = 'normal';
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.compile();
      });
    },
    beforeDestroy() {
      this.destroy();
    },
    watch: {
      naturalIndex() {
        this.destroy();
        this.compile();
      }
    }
  };
</script>
