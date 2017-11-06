<template>
  <div class="notFinishForm">
    <div>
      <Row>
          <Col span="4">
            <Form label-position="right" :label-width="80">
                <FormItem label="工单号：">
                    <Input v-model="select" placeholder="请输入工单编号"></Input>
                </FormItem>
                <FormItem label="品牌：">
                    <Select v-model="select" placeholder="请选择">
                        <Option value="beijing">北京市</Option>
                        <Option value="shanghai">上海市</Option>
                        <Option value="shenzhen">深圳市</Option>
                    </Select>
                </FormItem>
            </Form>
          </Col>
          <Col span="4">
            <Form label-position="right" :label-width="80">
                <FormItem label="工单状态：">
                    <Select v-model="select" placeholder="请选择">
                        <Option value="beijing">北京市</Option>
                        <Option value="shanghai">上海市</Option>
                        <Option value="shenzhen">深圳市</Option>
                    </Select>
                </FormItem>
                <FormItem label="产品大类：">
                    <Select v-model="select" placeholder="请选择">
                        <Option value="beijing">北京市</Option>
                        <Option value="shanghai">上海市</Option>
                        <Option value="shenzhen">深圳市</Option>
                    </Select>
                </FormItem>
            </Form>
          </Col>
          <Col span="4">
            <Form label-position="right" :label-width="80">
                <FormItem label="区域：">
                    <Select v-model="select" placeholder="请选择">
                        <Option value="beijing">北京市</Option>
                        <Option value="shanghai">上海市</Option>
                        <Option value="shenzhen">深圳市</Option>
                    </Select>
                </FormItem>
                <FormItem label="产品小类：">
                    <Select v-model="select" placeholder="请选择">
                        <Option value="beijing">北京市</Option>
                        <Option value="shanghai">上海市</Option>
                        <Option value="shenzhen">深圳市</Option>
                    </Select>
                </FormItem>
            </Form>
          </Col>
          <Col span="4">
            <Form label-position="right" :label-width="80">
                <FormItem label="片区：">
                    <Select v-model="select" placeholder="请选择">
                        <Option value="beijing">北京市</Option>
                        <Option value="shanghai">上海市</Option>
                        <Option value="shenzhen">深圳市</Option>
                    </Select>
                </FormItem>
                <FormItem label="工单类型：">
                    <Select v-model="select" placeholder="请选择">
                        <Option value="beijing">北京市</Option>
                        <Option value="shanghai">上海市</Option>
                        <Option value="shenzhen">深圳市</Option>
                    </Select>
                </FormItem>
            </Form>
          </Col>
          <Col span="4">
            <Form label-position="right" :label-width="80">
                <FormItem label="服务商：">
                    <Select v-model="select" placeholder="请选择">
                        <Option value="beijing">北京市</Option>
                        <Option value="shanghai">上海市</Option>
                        <Option value="shenzhen">深圳市</Option>
                    </Select>
                </FormItem>
                <FormItem label="派单日期：">
                    <Select v-model="select" placeholder="请选择">
                        <Option value="beijing">北京市</Option>
                        <Option value="shanghai">上海市</Option>
                        <Option value="shenzhen">深圳市</Option>
                    </Select>
                </FormItem>
            </Form>
          </Col>
          <Col span="3">
            <Form label-position="right" :label-width="50">
                <FormItem class="rightService" label=" ">
                </FormItem>
                <FormItem label="至：">
                    <Select v-model="select" placeholder="请选择">
                        <Option value="beijing">北京市</Option>
                        <Option value="shanghai">上海市</Option>
                        <Option value="shenzhen">深圳市</Option>
                    </Select>
                </FormItem>
            </Form>
          </Col>
      </Row>
    </div>

    <PageTable
      ref="notFinishTable"
      :columns="formInfo"
      @on-selection-change="onSelectionChange"
      pagePosition="middle">
    </PageTable>

    <modal v-model="orderAppointmentShow" width="600px">
      <p slot="header" style="text-align:center">
        <span>工单预约</span>
      </p>
      <Form label-position="right" :label-width="150">
        <FormItem label="预约上门日期">
            <Input style="width:350px;" v-model="select"></Input>
        </FormItem>
        <FormItem label="预约上门时间">
            <Input style="width:350px;" v-model="select"></Input>
        </FormItem>
        <FormItem label="备注">
            <Input v-model="select" style="width:350px;" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button>提交
        </Button>
      </div>
    </modal>

    <modal v-model="orderRemarksShow" width="600px">
      <p slot="header" style="text-align:center">
        <span>工单备注</span>
      </p>
      <Form label-position="right" :label-width="100">
        <FormItem label="备注">
            <Input v-model="select" style="width:400px;" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button>提交
        </Button>
      </div>
    </modal>
  </div>
</template>

<script>
  import PageTable from '@/components/Table/PageTable'
  export default {
    name: 'notFinishForm',
    components: {
      PageTable
    },
    data () {
        return {
            select: '',
            // 表格数据
            formInfo: [
              {
                type: 'selection',
                width: 60
              },
              {
                key: 'index1',
                align: 'center',
                title: "特许标识"
              },
              {
                key: 'index',
                align: 'center',
                title: "操作",
                className: 'ivu-table-info-column-engineerName',
                render: (h, {row, column, index}) => {
                  return h('div', {}, [
                    // h('span', {}, '预约'),
                    h('span', {
                      on: {
                        click: () => {
                          this.orderAppointment = true
                        }
                      }
                    }, '备注')
                  ])
                }
              },
              {
                key: 'index',
                align: 'center',
                title: "工单号"
              },
              {
                key: 'index',
                align: 'center',
                title: "品牌"
              },
              {
                key: 'index',
                align: 'center',
                title: "产品大类"
              },
              {
                key: 'index',
                align: 'center',
                title: "产品小类"
              },
              {
                key: 'index',
                align: 'center',
                title: "工单类型"
              },
              {
                key: 'index',
                align: 'center',
                title: "工单状态"
              },
              {
                key: 'index',
                align: 'center',
                title: "服务商代码"
              },
              {
                key: 'index',
                align: 'center',
                title: "服务商"
              },
              {
                key: 'index',
                align: 'center',
                title: "工程师"
              },
              {
                key: 'index',
                align: 'center',
                title: "紧急程度"
              },
              {
                key: 'index',
                align: 'center',
                title: "用户姓名"
              },
              {
                key: 'index',
                align: 'center',
                title: "用户电话"
              },
              {
                key: 'index',
                align: 'center',
                title: "用户地址"
              },
              {
                key: 'index',
                align: 'center',
                title: "提交时间"
              },
              {
                key: 'index',
                align: 'center',
                title: "代约时间"
              },
              {
                key: 'index',
                align: 'center',
                title: "客户要求时间"
              },
              {
                key: 'index',
                align: 'center',
                title: "预约完成时间"
              },
              {
                key: 'index',
                align: 'center',
                title: "预约上门时间"
              }
            ],
            // 工单预约 -- 弹窗
            orderAppointmentShow: false,
            // 工单备注 -- 弹窗
            orderRemarksShow: true
        }
    },
    methods: {
      load() {
        let params = {
          url: '',
          params: {
            // 参数
          }
        }
        this.$refs['notFinishTable'].load(params, () => {
          alert('haha')
        })
      },
      onSelectionChange (ids) {
        // 选中的勾选项组成的数组
      }
    }
  }
</script>

<style lang="scss" scoped>
.notFinishForm {
  .ivu-form-item-content .ivu-input {
    padding: 6px 7px;
  }
  .rightService {
    margin-bottom: 37px;
  }
}

</style>
