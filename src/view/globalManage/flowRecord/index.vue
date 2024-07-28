<style lang="less">
@import "./index.less";
</style>
<template>
    <div class="user-list">
        <Card :bordered="true">
            <Row :gutter="rowGutter">
                <Form ref="searchForm" :model="searchForm" :rules="searchRules" inline>
                    <FormItem prop="code">
                        <Input type="text" v-model="searchForm.code" placeholder="流水编号">
                            <Icon type="ios-color-filter" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="name">
                        <Input type="text" v-model="searchForm.name" placeholder="流水名称">
                            <Icon type="ios-color-filter" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="mod">
                        <Select v-model="searchForm.mod" :style="selectStyle" placeholder="流水方式">
                            <Option value="1">增加</Option>
                            <Option value="2">减少</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="type">
                        <Select v-model="searchForm.type" :style="selectStyle" placeholder="流水类型">
                            <Option v-for="item,i in typeList" :value="item.v">{{ item.k }}</Option>
                        </Select>
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
    </div>
</template>
<script>
import { pageMoneyLog } from '@/api/user'
import { checkTxt, checkTxtDef, timeFmt, checkFieldReqs } from '@/libs/util'
import { moneyLogTypeMap } from '@/libs/dict'
export default {
  name: 'money-log-list',
  components: {

  },
  props: {

  },
  data () {
    return {
      checkTxt,
      checkTxtDef,
      timeFmt,
      moneyLogTypeMap,
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
        {
          title: '流水编号',
          key: 'code'
        },
        {
          title: '流水名称',
          key: 'name'
        },
        {
          title: '流水详情',
          key: 'info'
        },
        {
          title: '流水类型',
          key: 'type',
          render: (h, params) => {
            let d = params.row
            let dict = moneyLogTypeMap
            let v = checkTxtDef(d.type, '')
            let sv = dict[v]
            sv = sv == null ? { v: '未定义', c: 'red' } : sv
            return h('Tag', { props: { color: sv.c } }, sv.v)
          }
        },
        {
          title: '流水金额',
          key: 'mod',
          render: (h, params) => {
            let d = params.row
            if (d.mod == 1) {
              return h('Tag', { props: { color: 'success' } }, `+${d.money}`)
            } else {
              return h('Tag', { props: { color: 'error' } }, `-${d.money}`)
            }
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
      typeList: []
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
      let typeList = []
      for (let k in moneyLogTypeMap) {
        typeList.push({ k: moneyLogTypeMap[k].v, v: k })
      }
      this.typeList = typeList
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
      return ps
    },
    getList () {
      let ps = this.getParams()
      this.isLoading = true
      let _that = this
      pageMoneyLog(ps).then(res => {
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
    }
  }
}
</script>
