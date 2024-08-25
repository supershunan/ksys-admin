<template>
    <div class="user-list">
        <Card :bordered="true">
            <Row :gutter="rowGutter">
                <Form ref="searchForm" :model="searchForm" :rules="searchRules" inline>
                  <FormItem prop="status">
                        <span>提现类型：</span>
                        <Select v-model="searchForm.status" :style="selectStyle" placeholder="状态">
                            <Option v-for="item,i in statusList" :value="item.v">{{ item.k }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                      <span>时间：</span>
                      <DatePicker @on-change="timeChange" type="daterange" split-panels placeholder="选择时间" style="width: 200px"></DatePicker>
                    </FormItem>
                    <FormItem prop="nickname">
                        <Input type="text" v-model="searchForm.nickname" placeholder="用户昵称或姓名"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" class="mg-btn" @click="searchData">查询</Button>
                        <Button class="mg-btn" @click="resetData">重置</Button>
                    </FormItem>
                </Form>
            </Row>
            <Row :gutter="rowGutter" class="margin-top10">
                <Table border :columns="columns" :data="datas" :loading="isLoading"></Table>
            </Row>
            <Row :gutter="rowGutter" class="margin-top10">
                <Page :current="pageData.page" :page-size="pageData.rows" :total="pageData.total" @on-change="pageChange"
                :page-size-opts="pageOpts" @on-page-size-change="pageOptChange"
                show-sizer show-elevator show-total />
            </Row>
        </Card>
        <detail ref="detail" @lastLoad="resetData"></detail>
        <recharge ref="recharge" @lastLoad="getList"></recharge>
    </div>
</template>
<script>
import imgIcon from '@/assets/images/icon/img.png'
import { pageData } from '@/api/user'
import { getMoneyListApi } from '@/api/financialManage'
import { checkTxt, checkTxtDef, timeFmt } from '@/libs/util'
import { userSexMap, userVipTypeMap, userStatusMap } from '@/libs/dict'
import detail from './detail.vue'
import recharge from './recharge.vue'
export default {
  name: 'user-list',
  components: {
    detail, recharge
  },
  props: {

  },
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
      searchRules: {

      },
      columns: [
        // {
        //   title: '用户头像',
        //   key: 'avatar',
        //   width: 100,
        //   render: (h, params) => {
        //     let d = params.row
        //     let url = d.avatar ? d.avatar : imgIcon
        //     return h('div', { attrs: { class: 'table-img' } }, [h('img', { attrs: { src: url } }, '')])
        //   }
        // },
        {
          title: '用户编码',
          key: 'code'
        },
        {
          title: '用户昵称',
          key: 'nickname'
        },
        {
          title: '提现方式',
          key: 'type'
        },
        {
          title: '提现信息',
          key: 'info'
        },
        // {
        //   title: '状态',
        //   key: 'vipType',
        //   width: 240,
        //   render: (h, params) => {
        //     let d = params.row
        //     let hList = []
        //     if (d.vipType) {
        //       let vipList = d.vipType.split('、')
        //       for (let i = 0; i < vipList.length; i++) {
        //         const val = vipList[i]
        //         let dict = userVipTypeMap
        //         let v = checkTxtDef(val, '')
        //         let sv = dict[v]
        //         sv = sv == null ? { v: '未定义', c: 'red' } : sv
        //         hList.push(h('Tag', { props: { color: sv.c } }, sv.v))
        //       }
        //     }
        //     return h('div', hList)
        //   }
        // },
        {
          title: '时间',
          key: 'type',
          render: (h, params) => {
            let d = params.row
            let txt = timeFmt(d.createTime)
            return h('div', txt)
          }
        }
        // {
        //   title: '用户状态',
        //   key: 'vipType',
        //   render: (h, params) => {
        //     let d = params.row
        //     let dict = userStatusMap
        //     let v = checkTxtDef(d.status, '')
        //     let sv = dict[v]
        //     sv = sv == null ? { v: '未定义', c: 'red' } : sv
        //     return h('Tag', { props: { color: sv.c } }, sv.v)
        //   }
        // }
      ],
      datas: [],
      statusList: []
    }
  },
  computed: {

  },
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
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
      getMoneyListApi(ps).then(res => {
        _that.datas = res.rows
        _that.pageData.total = res.total
        _that.isLoading = false
      }).catch(er => {
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
    }
  }
}
</script>
<style lang="less">
@import "./user.less";
</style>
