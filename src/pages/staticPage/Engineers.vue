<template>
  <div class="tablePanel">
    <div class="clearfix">
      <!-- 按钮组 -->
      <Button-group class="f-l">
        <Button>新增工程师</Button>
        <Button>批量审核</Button>
        <Button>批量上岗</Button>
        <Button>批量挂起</Button>
        <Button>批量冻结</Button>
        <Button>批量离岗</Button>
      </Button-group>
      <!-- 状态下拉 -->
      <div class="f-r flex align-center">
        状态：
        <Select v-model="model1" style="width:200px">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
    </div>
    <!-- 角色列表 -->
    <Table stripe :columns="columns1" :data="data1"></Table>
    <!-- 分页 -->
    <div class="clearfix">
      <Page :total="100"
        :page-size="10"
        show-elevator
        show-sizer
        show-total></Page>
    </div>
  </div>
</template>

<script>
  export default {
    // 名称
    name: 'Engineers',
    // 数据(初始/静态/待填充)
    data() {
      return {
        // 状态选择数据
        cityList: [
          {
            value: 'xinjian',
            label: '新建'
          },
          {
            value: 'guaqi',
            label: '挂起'
          },
          {
            value: 'shanggang',
            label: '上岗'
          },
          {
            value: 'dongjie',
            label: '冻结'
          },
          {
            value: 'ligang',
            label: '离岗'
          }
        ],
        model1: '',
        // 表单数据
        columns1: [
          {
            type: 'selection',
            width: 100,
            align: 'center'
          },
          {
            title: '序号',
            key: 'serialNumber',
            align: 'center'
          },
          {
            title: '状态',
            key: 'state',
            align: 'center'
          },
          {
            title: '员工号',
            key: 'employeeNumber',
            align: 'center'
          },
          {
            title: '工程师姓名',
            key: 'engineerName',
            align: 'center'
          },
          {
            title: '手机号',
            key: 'phoneNumber',
            align: 'center'
          },
          {
            title: '服务星级',
            key: 'star',
            align: 'center'
          },
          {
            title: '更新日期',
            key: 'updateDate',
            align: 'center'
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            render: (h, params) => {
                return h('div', [
                    h(
                      'Button', {
                        props: {
                            type: 'text'
                        },
                        style: {
                            marginRight: '5px'
                        },
                        on: {
                            click: () => {
                                console.log(111)
                                // this.show(params.index)
                            }
                        }
                      },
                      '编辑'
                    ),
                    h(
                      'Button', {
                        props: {
                            type: 'text'
                        },
                        on: {
                            click: () => {
                                console.log(222)
                            }
                        }
                      },
                      '挂起'
                    ),
                    h(
                      'Button', {
                        props: {
                            type: 'text'
                        },
                        on: {
                            click: () => {
                                console.log(333)
                            }
                        }
                      },
                      '上岗'
                    ),
                    h(
                      'Button', {
                        props: {
                            type: 'text'
                        },
                        on: {
                            click: () => {
                                console.log(444)
                            }
                        }
                      },
                      '冻结'
                    ),
                    h(
                      'Button', {
                        props: {
                            type: 'text'
                        },
                        on: {
                            click: () => {
                                console.log(555)
                            }
                        }
                      },
                      '离岗'
                    ),
                    h(
                      'Button', {
                        props: {
                            type: 'text'
                        },
                        on: {
                            click: () => {
                                console.log(666)
                            }
                        }
                      },
                      '信息审核'
                    )
                ]);
            }
          }
        ],
        data1: [
          {
            serialNumber: 1000,
            state: '上岗',
            employeeNumber: 20098,
            engineerName: '王超',
            phoneNumber: 13910001000,
            star: '三星级',
            updateDate: '2017/07/03 11:22:33',
            operation: '编辑 挂起 冻结 离岗',
            cellClassName: {
                engineerName: 'ivu-table-info-column-engineerName'
            }
          },
          {
            serialNumber: 1001,
            state: '挂起',
            employeeNumber: 25519,
            engineerName: 'XX(备注名)',
            phoneNumber: 13210002000,
            star: '一星级',
            updateDate: '2017/07/03 11:22:33',
            operation: '编辑 上岗 冻结 离岗',
            cellClassName: {
                engineerName: 'ivu-table-info-column-engineerName'
            }
          },
          {
            serialNumber: 1002,
            state: '新建',
            employeeNumber: '/',
            engineerName: '徐达',
            phoneNumber: 13155556666,
            star: '/',
            updateDate: '2017/07/03 11:22:33',
            operation: '编辑 信息审核',
            cellClassName: {
                engineerName: 'ivu-table-info-column-engineerName'
            }
          }
        ]
      }
    },
    // 钩子(创建执行)
    created() {
    },
    // 方法
    methods: {
      // show (index) {
      //   this.$Modal.info({
      //     title: '用户信息',
      //     content: `姓名：${this.data6[index].name}<br>年龄：${this.data6[index].age}<br>地址：${this.data6[index].address}`
      //   })
      // }
    }
  }
</script>
<style lang="scss">
  @import "../../styles/base";

</style>

