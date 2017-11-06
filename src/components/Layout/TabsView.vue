<template>
  <div class="tabs-view clearfix" ref="tabs-view">
    <!-- <ButtonGroup shape="circle">
      <Button class="views-go-left" icon="ios-skipbackward" v-if="visitedViews.length > 3" :disabled="1"></Button> -->
      <router-link class="tabs-link" v-for="(tag, index) in visitedViews" :to="{ path: tag.path, query: tag.query}" :key="tag.path">
        <Tag closable type="dot" ref="tag" :color="isActive(tag.path) ? 'green' : 'blue'" @click.native="sendLinkChange(tag.meta)" @on-close="closeViewTabs(tag,$event)">
          {{ tag.meta.title }}
        </Tag>
      </router-link>
      <!-- <Button class="views-go-right" icon="ios-skipforward" v-if="visitedViews.length > 3" :disabled="1"></Button>
    </ButtonGroup> -->
  </div>
</template>

<script>
  export default {
    computed: {
      visitedViews () {
        let views = this.$store.state.views.visitedViews
          .slice(/* -this.size */)
          .filter((item) => {
            return item.meta.isTabView // 排除首页
          })
        this.$store.dispatch('setTabsView', views)
        return views
      }
    },
    // filters: {
    //   visitedViews (value) {
    //     console.log(v, 'vvv')
    //     return value.filter((item) => {
    //     return item.name !== 'Index' // 排除首页
    //     })
    //   }
    // },
    data () {
      return {
        size: 10, // 页面最大数目
        tabsViewWidth: 0, // 盒子宽度
        realAllWidth: 0, // 真实宽度
        lastTagWidth: 0, // 添加的最后一个标签宽度
        deletedTagWidth: 0, // 被删除的标签宽度
        isFirstGreater: false // 加上此标签就超过最大长度
      }
    },
    updated () {
      console.log(this.tabsViewWidth, '盒子宽度')
      console.log(this.realAllWidth, '真实宽度')
      console.log(this.lastTagWidth, '添加标签宽度')
      console.log(this.deletedTagWidth, '被删除标签宽度')
    },
    mounted () {
      this.tabsViewWidth = parseFloat(dom.getStyle(this.$refs['tabs-view'], 'width')) // 获取外层box宽度
    },
    methods: {
      getAssignWidth (isMinus) {
        if (!isMinus) {
          if (this.isFirstGreater) {
            return (this.realAllWidth - this.tabsViewWidth) // |---|+++++|
          } else {
            return this.lastTagWidth // |++++++++|
          }
        } else {
          return this.deletedTagWidth
        }
      },
      setResponseTagWidth (isMinus) {
        if (this.$refs['tag']) {
          let len = this.$refs['tag'].length
          this.$refs['tag'].map((vm, index) => {
            let tagWidth = parseFloat(dom.getStyle(vm.$el, 'width'))
            if (index === len - 1) {
              this.lastTagWidth = tagWidth
              this.realAllWidth += this.lastTagWidth
            }
          })
          if (this.realAllWidth > this.tabsViewWidth) {
            if (!this.isFirstGreater) {
              this.isFirstGreater = true
            }
            let widthNeedToAssign = this.getAssignWidth(isMinus)
            let diff = widthNeedToAssign / len
            this.$refs['tag'].map((vm, index) => {
              let tagTextWidth = vm.$el.querySelector('.ivu-tag-text')['offsetWidth'] // auto
              if (isMinus) {
                tagTextWidth = tagTextWidth + diff // 拉长
              } else {
                tagTextWidth = tagTextWidth - diff // 缩短
              }
              dom.setStyle(vm.$el.querySelector('.ivu-tag-text'), {
                'width': tagTextWidth + 'px',
                'minWidth': '1em',
                'transition': 'all .2s ease',
                'textOverflow': 'ellipsis',
                'overflow': 'hidden',
                'lineHeight': '1',
                'verticalAlign': 'text-top',
                'display': 'inline-block',
                'whiteSpace': 'nowrap'
              })
            })
          } else if (isMinus) {
            this.isFirstGreater = false
            this.$refs['tag'].map((vm, index) => {
              dom.setStyle(vm.$el.querySelector('.ivu-tag-text'), {
                'display': 'inline',
                'width': 'auto'
              })
            })
          }
        }
      },
      closeViewTabs (view, $event) {
        this.deletedTagWidth = parseFloat(dom.getStyle($event.currentTarget, 'width'))
        console.log($event.currentTarget, dom.getStyle($event.currentTarget, 'width'))
        this.$store.dispatch('delVisitedViews', view).then((views) => {
          if (this.isActive(view.path)) {
            const latestView = views.slice(-1)[0]
            if (latestView) {
              this.$router.push(latestView.path)
            } else {
              this.$router.push('/')
              common.sendEvent('link-change', ['首页'])
            }
          }
        })
        $event.preventDefault()
      },
      sendLinkChange (meta) {
        let breadcrumb = (meta.breadcrumb || '') + meta.title
        common.sendEvent('link-change', [breadcrumb])
      },
      generateRoute () {
        // if (this.$route.matched[this.$route.matched.length - 1].name) {
        //   return this.$route.matched[this.$route.matched.length - 1]
        // }
        // this.$route.matched[0].path = '/'
        // return this.$route.matched[0]
        return this.$route
      },
      addViewTabs () {
        this.$store.dispatch('addVisitedViews', this.generateRoute())
      },
      isActive (path) {
        return path === this.$route.path
      }
    },
    watch: {
      $route(v) {
        this.addViewTabs()
      },
      visitedViews (n, o) {
        let isMinus = n.length < o.length
        this.$nextTick(() => {
          this.setResponseTagWidth(isMinus)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .ivu-tag-blue.ivu-tag-dot .ivu-tag-dot-inner {
      background: #004464;
  }
  .ivu-tag {
    margin-right: -1px;
    // border-bottom-color: #fff!important;
  }
  .ivu-btn-group>.ivu-btn {
  }
  .tabs-link {
    float: left;
  }
  .tabs-view {
    height: 36px;
  }
  .ivu-tag-text {
    min-width: 1em;
    transition: all .2s ease;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
    white-space: nowrap;
  }
</style>

