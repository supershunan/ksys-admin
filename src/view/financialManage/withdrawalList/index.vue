<template>
  <div class="user-list">
    <Card :bordered="true">
      <Row :gutter="rowGutter">
        <Form ref="searchForm" :model="searchForm" :rules="searchRules" inline>
          <!-- <FormItem prop="status">
            <span>提现类型：</span>
            <Select
              v-model="searchForm.status"
              :style="selectStyle"
              placeholder="状态"
            >
              <Option v-for="(item, i) in statusList" :value="item.v">{{
                item.k
              }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <span>时间：</span>
            <DatePicker
              @on-change="timeChange"
              type="daterange"
              split-panels
              placeholder="选择时间"
              style="width: 200px"
            ></DatePicker>
          </FormItem>
          <FormItem prop="nickname">
            <Input
              type="text"
              v-model="searchForm.nickname"
              placeholder="用户昵称或姓名"
            ></Input>
          </FormItem> -->
          <FormItem>
            <!-- <Button type="primary" class="mg-btn" @click="searchData"
              >查询</Button
            > -->
            <Button class="mg-btn" @click="resetData">重置</Button>
            <Button type="primary" class="mg-btn" @click="exportData">导出待提现账单</Button>
            <Upload style="display: inline-block;" ref="uploadRef" action="/newApi/withdrawal/import" :multiple="false" :headers="headers" :on-success="uploadSuccess" :on-error="uploadError">
                <Button type="success" icon="ios-cloud-upload-outline">更新提现状态</Button>
            </Upload>
          </FormItem>
        </Form>
      </Row>
      <Row :gutter="rowGutter" class="margin-top10">
        <Table
          border
          :columns="columns"
          :data="datas"
          :loading="isLoading"
        ></Table>
      </Row>
      <Row :gutter="rowGutter" class="margin-top10">
        <Page
          :current="pageData.page"
          :page-size="pageData.rows"
          :total="pageData.total"
          @on-change="pageChange"
          :page-size-opts="pageOpts"
          @on-page-size-change="pageOptChange"
          show-sizer
          show-elevator
          show-total
        />
      </Row>
    </Card>
    <detail ref="detail" @lastLoad="resetData"></detail>
    <recharge ref="recharge" @lastLoad="getList"></recharge>
  </div>
</template>
<script>
import imgIcon from '@/assets/images/icon/img.png'
import { getWithdrawalListApi, exportMoneyListApi, importResultApi } from '@/api/financialManage'
import { checkTxt, checkTxtDef, timeFmt } from '@/libs/util'
import { userSexMap, userStatusMap } from '@/libs/dict'
import detail from './detail.vue'
import recharge from './recharge.vue'
export default {
  name: 'user-list',
  components: {
    detail,
    recharge
  },
  props: {},
  data () {
    return {
      checkTxt,
      checkTxtDef,
      timeFmt,
      imgIcon,
      userSexMap,
      userStatusMap,
      pageData: {
        page: 1,
        rows: 10,
        total: 0
      },
      pageOpts: [10, 20, 50, 100],
      isLoading: false,
      rowGutter: 10,
      selectStyle: { width: '189px' },
      searchForm: {},
      searchRules: {},
      columns: [
        {
          title: '用户账号',
          key: 'account'
        },
        {
          title: '用户姓名',
          key: 'name'
        },
        {
          title: '用户昵称',
          key: 'nickname'
        },
        {
          title: '提现金额',
          key: 'realMoney'
        },
        {
          title: '订单编号',
          key: 'orderNo'
        },
        {
          title: '提现方式',
          key: 'type',
          render: (h, params) => {
            let d = params.row
            let txt = this.channelToText(d.channel)
            return h('div', txt)
          }
        },
        {
          title: '提现状态',
          key: 'status',
          render: (h, params) => {
            let d = params.row
            let txt = d.status === 'SUCCESS' ? '成功' : '待打款'
            let color = d.status === 'SUCCESS' ? 'success' : 'warning'
            return h('Tag', { props: { color: color } }, txt)
          }
        },
        {
          title: '时间',
          key: 'type',
          render: (h, params) => {
            let d = params.row
            let txt = timeFmt(d.createTime)
            return h('div', txt)
          }
        }
      ],
      datas: [],
      statusList: [],
      headers: {}
    }
  },
  computed: {},
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.headers[this.$store.state.user.tokenHeader] = this.$store.state.user.token
      this.initDictData()
      this.getList()
    },
    initDictData () {
      let statusList = []
      for (let k in userStatusMap) {
        statusList.push({ k: userStatusMap[k].v, v: k })
      }
      this.statusList = statusList
    },
    getParams () {
      let pd = this.pageData
      let ps = {
        page: pd.page,
        rows: pd.rows
      }
      let sf = this.searchForm
      for (let k in sf) {
        if (checkTxt(sf[k])) ps[k] = sf[k]
      }
      ps.type = 'cash'
      return ps
    },
    getList () {
      let ps = this.getParams()
      this.isLoading = true
      let _that = this
      getWithdrawalListApi(ps)
        .then((res) => {
          _that.datas = res.rows
          _that.pageData.total = res.total
          _that.isLoading = false
        })
        .catch((er) => {
          _that.isLoading = false
        })
    },
    searchData () {
      this.pageData.page = 1
      this.pageData.total = 0
      this.getList()
    },
    resetData () {
      this.pageData.page = 1
      this.pageData.total = 0
      this.searchForm = {}
      this.getList()
    },
    pageChange (v) {
      this.pageData.page = v
      this.pageData.total = 0
      this.getList()
    },
    pageOptChange (v) {
      this.pageData.page = 1
      this.pageData.rows = v
      this.pageData.total = 0
      this.getList()
    },
    timeChange (v) {
      console.log(v)
    },
    channelToText (channel) {
      if (channel === 'offline') {
        return '转账'
      } else if (channel === 'ALIPAY') {
        return '支付宝'
      } else {
        return '未知'
      }
    },
    exportData () {
      exportMoneyListApi()
        .then((response) => {
          const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })

          // 创建下载链接
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url

          const fileName = `待打款数据_${new Date().toISOString().slice(0, 10)}.xlsx`
          link.download = fileName

          // 触发下载
          document.body.appendChild(link)
          link.click()

          // 清理
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)

          console.log('导出待打款数据成功')
        })
        .catch((er) => {
          console.log('导出待打款数据失败', er)
        })
    },
    importData () {
      importResultApi()
    },
    uploadSuccess (res) {
      this.$refs.uploadRef.clearFiles()
      this.$Message.success({
        content: res.msg,
        duration: 3
      })
      this.getList()
    },
    uploadError (err) {
      this.$refs.uploadRef.clearFiles()
      this.$Message.warning('上传失败')
      console.log('上传失败', err)
    }
  }
}
</script>
<style lang="less">
@import "./user.less";
</style>
