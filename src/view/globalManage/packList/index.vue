<template>
    <div>
        <Card :bordered="true">
            <Row :gutter="rowGutter">
                <Form ref="searchForm" :model="searchForm" :rules="searchRules" inline>
                    <FormItem prop="code">
                        <Input type="text" v-model="searchForm.code" placeholder="套餐编号">
                            <Icon type="ios-color-filter" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="name">
                        <Input type="text" v-model="searchForm.name" placeholder="套餐名称">
                            <Icon type="ios-color-filter" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="type">
                        <Select v-model="searchForm.type" :style="selectStyle" placeholder="套餐类型">
                            <Option v-for="item,i in typeList" :value="item.v">{{ item.k }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="use">
                        <Select v-model="searchForm.use" :style="selectStyle" placeholder="套餐状态">
                            <Option v-for="item,i in useList" :value="item.v">{{ item.k }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" class="mg-btn" @click="searchData">查询</Button>
                        <Button class="mg-btn" @click="resetData">重置</Button>
                    </FormItem>
                </Form>
            </Row>
            <Row :gutter="rowGutter">
                <Button type="primary" class="mg-btn" @click="add('recharge')" v-if="authMap['packAddRecharge']"><Icon type="md-add" size="16" /> 新增充值套餐</Button>
                <Button type="primary" class="mg-btn" @click="add('video')" v-if="authMap['packAddVideo']"><Icon type="md-add" size="16" /> 新增视频套餐</Button>
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
        <packEdit ref="packEdit" @lastLoad="searchData"></packEdit>
    </div>
</template>
<script>
import { pageData, delData, changeUseData } from '@/api/pack'
import { checkTxt, checkTxtDef, timeFmt, checkFieldReqs } from '@/libs/util'
import { packTypeMap, packUseMap } from '@/libs/dict'
import packEdit from './packEdit.vue'
export default {
  name: 'pack-list',
  components: {
    packEdit
  },
  props: {

  },
  data () {
    return {
      checkTxt,
      checkTxtDef,
      timeFmt,
      packTypeMap,
      packUseMap,
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
          fixed: 'left',
          title: '套餐编号',
          key: 'code',
          tooltip: true,
          width: 240
        },
        {
          fixed: 'left',
          title: '套餐名称',
          key: 'name',
          tooltip: true,
          width: 260,
          render: (h, params) => {
            let d = params.row
            let v = checkTxtDef(d.name, '未命名')
            return h('div', `${v}`)
          }
        },
        {
          title: '原价',
          key: 'originMoney',
          tooltip: true,
          width: 150,
          render: (h, params) => {
            let d = params.row
            let v = checkTxtDef(d.originMoney, '0')
            return h('div', { style: { color: '#66a5e9' } }, `${v}元`)
          }
        },
        {
          title: '优惠价',
          key: 'money',
          tooltip: true,
          width: 150,
          render: (h, params) => {
            let d = params.row
            let v = checkTxtDef(d.money, '0')
            return h('div', { style: { color: '#f1606c' } }, `${v}元`)
          }
        },
        {
          title: '套餐类型',
          key: 'type',
          width: 120,
          render: (h, params) => {
            let d = params.row
            let dict = packTypeMap
            let v = checkTxtDef(d.type, '')
            let sv = dict[v]
            sv = sv == null ? { v: '未定义', c: 'red' } : sv
            return h('Tag', { props: { color: sv.c } }, sv.v)
          }
        },
        {
          title: '其他',
          tooltip: true,
          width: 200,
          render: (h, params) => {
            let d = params.row
            let v = '无'
            if (d.type == 'recharge') {
              v = `${d.res ? `可获得平台币${d.res}，` : ''}${d.gifts ? `赠送平台币${d.gifts}` : ''}`
            }
            return h('div', `${v}`)
          }
        },
        {
          title: '状态',
          key: 'use',
          width: 120,
          render: (h, params) => {
            let d = params.row
            let dict = packUseMap
            let v = checkTxtDef(d.use, '')
            let sv = dict[v]
            sv = sv == null ? { v: '未定义', c: 'error' } : sv
            return h('Tag', { props: { color: sv.c } }, sv.v)
          }
        },
        {
          title: '创建时间',
          key: 'type',
          width: 160,
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
          fixed: 'right',
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
                  display: [2].includes(row.use) ? '' : 'none'
                },
                on: {
                  click: () => {
                    this.changeUse(row)
                  }
                }
              }, '上架'),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: [1].includes(row.use) ? '' : 'none'
                },
                on: {
                  click: () => {
                    this.changeUse(row)
                  }
                }
              }, '下架'),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.update(row)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {

                },
                on: {
                  click: () => {
                    this.del(row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      datas: [],
      typeList: [],
      statusList: [],
      authMap: {}
    }
  },
  computed: {

  },
  created () {},
  mounted () {
    this.authMap = this.$store.state.user.userInfo.authMap
    this.init()
  },
  methods: {
    init () {
      this.initDictData()
      this.getList()
    },
    initDictData () {
      let typeList = []
      for (let k in packTypeMap) {
        typeList.push({ k: packTypeMap[k].v, v: k })
      }
      this.typeList = typeList
      let useList = []
      for (let k in packUseMap) {
        useList.push({ k: packUseMap[k].v, v: k })
      }
      this.useList = useList
    },
    getParams () {
      let pd = this.pageData
      let ps = {
        page: pd.page,
        rows: pd.rows
      }
      let sf = this.searchForm
      if (this.pid) {
        sf.pid = this.pid
      } else {
        sf.pid = null
      }
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
      this.pid = null
      this.pName = ''
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
    changeUse (row) {
      let _that = this
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定执行该操作吗？</p>',
        onOk: () => {
          _that.isLoading = true
          changeUseData(row.id).then(res => {
            _that.isLoading = false
            _that.$Message.success('执行成功')
            _that.getList()
          })
        },
        onCancel: () => {

        }
      })
    },
    add (dt) {
      this.$refs.packEdit.open(dt, 'add', null)
    },
    update (row) {
      this.$refs.packEdit.open(row.type, 'update', row.id)
    },
    del (row) {
      let _that = this
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定删除该用户吗？</p>',
        onOk: () => {
          _that.isLoading = true
          delData({ ids: row.id }).then(res => {
            _that.isLoading = false
            _that.$Message.success('删除成功')
            _that.getList()
          })
        },
        onCancel: () => {

        }
      })
    }
  }
}
</script>
<style lang="less">

</style>
