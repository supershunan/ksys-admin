<template>
    <div>
        <Card>
            <template #title>
                <span class="notice_title">轮播图</span>
            </template>
            <div>
            2131
            </div>
        </Card>
        <Card>
            <template #title>
                <span class="notice_title">公告栏</span>
            </template>
            <div>
                <div style="display: flex; align-items: center;">
                    <span style="min-width: 80px;">公告内容：</span>
                    <Input v-model="bulletinBoard" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入公告"></Input>
                </div>
                <div style="display: flex; justify-content: end; margin-top: 5px;">
                    <Button type="primary">保存</Button>
                </div>
            </div>
        </Card>
        <Card>
            <template #title>
                <span class="notice_title">公告历史</span>
            </template>
            <Button type="primary" @click="modal1 = true">添加公告</Button>
            <Table border :columns="columns1" :data="data1">
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="error" size="small" @click="remove(index)">删除</Button>
                </template>
            </Table>
            <Page :total="total" show-sizer @on-change="pageCange" @on-page-size-change="pageSizeChange" />
            <Modal
                v-model="modal1"
                title="公告内容"
                @on-ok="ok"
                @on-cancel="cancel">
                <Input v-model="value5" type="textarea" placeholder="Enter something..." />
            </Modal>
        </Card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      bulletinBoard: '公告栏',
      columns1: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '内容',
          align: 'center',
          key: 'name'
        },
        {
          title: '时间',
          align: 'center',
          width: 100,
          key: 'date'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      data1: [
        {
          name: 'John Brown',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          date: '2016-10-04'
        }
      ],
      modal1: false,
      value5: 'John',
      total: 100
    }
  },
  methods: {
    ok () {
      this.$Message.info('Clicked ok')
    },
    cancel () {
      this.$Message.info('Clicked cancel')
    },
    remove (index) {
    //   this.data6.splice(index, 1)
      this.$Modal.confirm({
        title: '是否删除？',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          this.$Message.info('Clicked ok')
        },
        onCancel: () => {
          this.$Message.info('Clicked cancel')
        }
      })
    },
    pageCange (index) {
      console.log(index)
    },
    pageSizeChange (index) {
      console.log(index)
    },
    imgResult (v) {
      let field = this.nowField
      let d = { ...this.dataForm }
      d[field] = v
      this.dataForm = d
    }
  }
}
</script>

<style scoped>
.notice_title {
    font-size: 20px;
    font-weight: bolder;
}
</style>
