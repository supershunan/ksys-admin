<template>
    <div>
        <Card>
            <template #title>
                <span class="notice_title">反馈</span>
            </template>
            <Table border :columns="feedbackColumns" :data="feedbackData">
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="error" size="small" @click="feadbackRemove(row)">删除</Button>
                </template>
            </Table>
            <Page :total="feadbackTotal" :page-size="5" show-sizer @on-change="feadbackPageCange" @on-page-size-change="feadbackPageSizeChange" :page-size-opts="[5, 10, 20, 40]" />
        </Card>
        <Card style="margin-top: 30px;">
            <template #title>
                <span class="notice_title">合作</span>
            </template>
            <Table border :columns="cooperateColumns" :data="cooperateData">
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="error" size="small" @click="cooperateRemove(row)">删除</Button>
                </template>
            </Table>
            <Page :total="cooperateTotal" :page-size="5" show-sizer @on-change="cooperatePageCange" @on-page-size-change="cooperatePageSizeChange" :page-size-opts="[5, 10, 20, 40]" />
        </Card>
    </div>
</template>

<script>
import { getFeedbackListApi, deleteFeedbackApi } from '@/api/expertEnd'
export default {
  data () {
    return {
      feadbackParams: {
        page: 1,
        rows: 5,
        type: '1'
      },
      feadbackTotal: 0,
      feedbackColumns: [
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
          key: 'info'
        },
        {
          title: '手机号/微信号',
          align: 'center',
          width: 150,
          key: 'phone'
        },
        {
          title: '时间',
          align: 'center',
          width: 100,
          key: 'createTime'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      feedbackData: [],
      cooperateParams: {
        page: 1,
        rows: 5,
        type: '2'
      },
      cooperateTotal: 0,
      cooperateColumns: [
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
          key: 'info'
        },
        {
          title: '手机号/微信号',
          align: 'center',
          width: 150,
          key: 'phone'
        },
        {
          title: '时间',
          align: 'center',
          width: 100,
          key: 'createTime'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      cooperateData: []
    }
  },
  mounted () {
    this.getFeadbackList()
    this.getCooperateList()
  },
  methods: {
    getFeadbackList () {
      getFeedbackListApi(this.feadbackParams).then(res => {
        this.feedbackData = res.rows
        this.feadbackTotal = res.total
      })
    },
    feadbackRemove (item) {
      this.$Modal.confirm({
        title: '是否删除？',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          deleteFeedbackApi({ ids: item.id }).then(() => {
            this.$Message.info('删除成功')
            this.getFeadbackList()
          })
        },
        onCancel: () => {
          this.$Message.info('取消')
        }
      })
    },
    feadbackPageCange (index) {
      this.feadbackParams.page = index
      this.getFeadbackList()
    },
    feadbackPageSizeChange (index) {
      this.feadbackParams.rows = index
      this.getFeadbackList()
    },
    getCooperateList () {
      getFeedbackListApi(this.cooperateParams).then(res => {
        this.cooperateData = res.rows
        this.cooperateTotal = res.total
      })
    },
    cooperateRemove (item) {
      this.$Modal.confirm({
        title: '是否删除？',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          deleteFeedbackApi({ ids: item.id }).then(() => {
            this.$Message.info('删除成功')
            this.getCooperateList()
          })
        },
        onCancel: () => {
          this.$Message.info('取消')
        }
      })
    },
    cooperatePageCange (index) {
      this.cooperateParams.page = index
      this.getCooperateList()
    },
    cooperatePageSizeChange (index) {
      this.cooperateParams.rows = index
      this.getCooperateList()
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
