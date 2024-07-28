<template>
    <div class="order-list">
        <Card :bordered="true">
            <Row :gutter="rowGutter">
                <Form ref="searchForm" :model="searchForm" :rules="searchRules" inline>
                    <FormItem prop="code">
                        <Input type="text" v-model="searchForm.code" placeholder="申请编号">
                            <Icon type="ios-color-filter" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="name">
                        <Input type="text" v-model="searchForm.name" placeholder="申请名称">
                            <Icon type="ios-color-filter" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="info">
                        <Input type="text" v-model="searchForm.info" placeholder="申请内容">
                            <Icon type="ios-color-filter" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="type">
                        <Select v-model="searchForm.type" :style="selectStyle" placeholder="申请类型">
                            <Option v-for="item,i in typeList" :value="item.v">{{ item.k }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="status">
                        <Select v-model="searchForm.status" :style="selectStyle" placeholder="申请状态">
                            <Option v-for="item,i in statusList" :value="item.v">{{ item.k }}</Option>
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
        <worksDetail ref="worksDetail"></worksDetail>
    </div>
</template>
<script>
import { pageData, audData } from '@/api/apply'
import { checkTxt, checkTxtDef, timeFmt } from '@/libs/util'
import { applyTypeMap, applyStatusMap } from '@/libs/dict'
import worksDetail from './worksDetail.vue'
export default {
  name: 'apply-list',
  components: {
    worksDetail
  },
  props: {

  },
  data () {
    return {
      checkTxt,
      checkTxtDef,
      timeFmt,
      applyTypeMap,
      applyStatusMap,
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
          title: '申请单号',
          key: 'code'
        },
        {
          title: '申请名称',
          key: 'name'
        },
        {
          title: '申请内容',
          key: 'info',
          width: 300
        },
        {
          title: '申请类型',
          key: 'type',
          render: (h, params) => {
            let d = params.row
            let dict = applyTypeMap
            let v = checkTxtDef(d.type, '')
            let sv = dict[v]
            sv = sv == null ? '未定义' : sv
            return h('div', sv)
          }
        },
        {
          title: '申请状态',
          key: 'status',
          render: (h, params) => {
            let d = params.row
            let dict = applyStatusMap
            let v = checkTxtDef(d.status, '')
            let sv = dict[v]
            sv = sv == null ? { v: '未定义', c: 'error' } : sv
            return h('Tag', { props: { color: sv.c } }, sv.v)
          }
        },
        {
          title: '申请时间',
          key: 'createTime',
          render: (h, params) => {
            let d = params.row
            let txt = timeFmt(d.createTime)
            return h('div', txt)
          }
        },
        {
          title: 'Action',
          key: 'action',
          width: 240,
          align: 'center',
          render: (h, params) => {
            let row = params.row
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: row.type == 'video' ? '' : 'none'
                },
                on: {
                  click: () => {
                    this.info(row)
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: row.status == 1 ? '' : 'none'
                },
                on: {
                  click: () => {
                    this.aud(row, 9)
                  }
                }
              }, '通过'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  display: row.status == 1 ? '' : 'none'
                },
                on: {
                  click: () => {
                    this.aud(row, 2)
                  }
                }
              }, '打回')
            ])
          }
        }
      ],
      datas: [],
      typeList: [],
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
      let typeList = []
      for (let k in applyTypeMap) {
        typeList.push({ k: applyTypeMap[k], v: k })
      }
      this.typeList = typeList
      let statusList = []
      for (let k in applyStatusMap) {
        statusList.push({ k: applyStatusMap[k].v, v: k })
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
      return ps
    },
    getList () {
      let ps = this.getParams()
      this.isLoading = true
      let _that = this
      pageData(ps).then(res => {
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
    aud (row, status) {
      let _that = this
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定进行该操作吗？</p>',
        onOk: () => {
          _that.isLoading = true
          audData({ id: row.id, status: status }).then(res => {
            _that.isLoading = false
            _that.$Message.success('审核成功')
            _that.getList()
          })
        },
        onCancel: () => {

        }
      })
    },
    info (row) {
      this.$refs.worksDetail.open(row.corId)
    }
  }
}
</script>
