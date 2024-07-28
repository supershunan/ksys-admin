<template>
    <div>
        <Card>
            <template #title>
                <span class="notice_title">反馈</span>
            </template>
            <Table border :columns="columns1" :data="data1">
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="error" size="small" @click="remove(index)">删除</Button>
                </template>
            </Table>
            <Page :total="total" show-sizer @on-change="pageCange" @on-page-size-change="pageSizeChange" />
        </Card>
        <Card style="margin-top: 30px;">
            <template #title>
                <span class="notice_title">合作</span>
            </template>
        </Card>
        <Modal
            v-model="modal1"
            title="反馈合作"
            @on-ok="ok"
            @on-cancel="cancel">
        </Modal>
    </div>
</template>

<script>
export default {
  data () {
    return {
      total: 100,
      columns1: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '称呼',
          align: 'center',
          width: 100,
          key: 'name'
        },
        {
          title: '内容',
          align: 'center',
          key: 'content'
        },
        {
          title: '手机号/微信号',
          align: 'center',
          width: 100,
          key: 'phone'
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
          content: 'sldkflskdlfjsldfjlsd',
          phone: '15888888888',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          content: 'sldkflskdlfjsldfjlsd',
          phone: '15888888888',
          date: '2016-10-01'
        }
      ]
    }
  },
  methods: {
    remove (index) {
      this.data6.splice(index, 1)
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
