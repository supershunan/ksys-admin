<style lang="less">
@import "./user.less";
</style>
<template>
    <div class="user-list">
        <Card :bordered="true">
            <Row :gutter="rowGutter">
                <Form ref="searchForm" :model="searchForm" :rules="searchRules" inline>
                    <FormItem prop="account">
                        <Input type="text" v-model="searchForm.account" placeholder="用户账号">
                            <Icon type="ios-color-filter" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="nickname">
                        <Input type="text" v-model="searchForm.nickname" placeholder="用户昵称">
                            <Icon type="ios-color-filter" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="phone">
                        <Input type="text" v-model="searchForm.phone" placeholder="用户电话">
                            <Icon type="ios-color-filter" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <!-- <FormItem prop="sex">
                        <Select v-model="searchForm.sex" :style="selectStyle" placeholder="性别">
                            <Option v-for="item,i in sexList" :value="item.v">{{ item.k }}</Option>
                        </Select>
                    </FormItem> -->
                    <FormItem prop="status">
                        <Select v-model="searchForm.status" :style="selectStyle" placeholder="状态">
                            <Option v-for="item,i in statusList" :value="item.v">{{ item.k }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" class="mg-btn" @click="searchData">查询</Button>
                        <Button class="mg-btn" @click="resetData">重置</Button>
                    </FormItem>
                </Form>
            </Row>
            <!-- <Row :gutter="rowGutter">
                <Button type="primary" class="mg-btn" @click="add">添加</Button>
            </Row> -->
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
    </div>
</template>
<script>
import imgIcon from '@/assets/images/icon/img.png'
import { pageData, delData, banData, updateMyInfo } from '@/api/user'
import { getUserInfolistApi, UpgradeToleaderApi, cancelCommanderApi } from '@/api/userManage'
import { checkTxt, checkTxtDef, timeFmt, checkFieldReqs } from '@/libs/util'
import { userSexMap, userVipTypeMap, userStatusMap, customerTypeMap } from '@/libs/dict'
import detail from './detail.vue'
export default {
  name: 'user-list',
  components: {
    detail
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
        {
          title: '基本信息',
          key: 'avatar',
          width: 200,
          render: (h, params) => {
            let d = params.row
            let url = d.avatar ? d.avatar : imgIcon
            return h('div', { attrs: { class: 'table-img' } }, [
              h('img', { attrs: { src: url } }, ''),
              h('div', { atrs: { class: 'nickname' } }, `${d.nickname}`)
            ])
          }
        },
        {
          title: '个人信息',
          align: 'center',
          children: [
            {
              title: '姓名',
              key: 'nickname',
              align: 'center',
              width: 100
            },
            {
              title: '手机号',
              key: 'phone',
              align: 'center',
              width: 100
            },
            {
              title: '账号',
              key: 'account',
              align: 'center',
              width: 100
            }
          ]
        },
        {
          title: '佣金信息',
          align: 'center',
          children: [
            {
              title: '可提现佣金',
              key: 'canWithdrawalBalance',
              align: 'center',
              width: 100
            },
            {
              title: '累计佣金',
              key: 'totalIncome',
              align: 'center',
              width: 100
            }
          ]
        },
        {
          title: '本人收益',
          key: 'money',
          align: 'center',
          width: 100
        },
        {
          title: '入驻时间',
          key: 'type',
          render: (h, params) => {
            let d = params.row
            let txt = timeFmt(d.createTime)
            return h('div', txt)
          }
        },
        {
          title: '用户状态',
          key: 'vipType',
          render: (h, params) => {
            let d = params.row
            let dict = userStatusMap
            let v = checkTxtDef(d.status, '')
            let sv = dict[v]
            sv = sv == null ? { v: '未定义', c: 'red' } : sv
            return h('Tag', { props: { color: sv.c } }, sv.v)
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
                  type: row.type.split(',').includes('commander') ? 'warning' : 'success',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    if (row.type.split(',').includes('commander')) {
                      this.cancelCommander(row)
                    } else {
                      this.upgradeToleader(row)
                    }
                  }
                }
              }, row.type.split(',').includes('commander') ? '撤销团长' : '升级团长'),
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
                  marginRight: '5px',
                  display: row.status == 1 ? '' : 'none'
                },
                on: {
                  click: () => {
                    this.ban(row)
                  }
                }
              }, '封禁'),
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: row.status == 2 ? '' : 'none'
                },
                on: {
                  click: () => {
                    this.ban(row)
                  }
                }
              }, '解封'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
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
      sexList: [],
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
      let sexList = []
      for (let k in userSexMap) {
        sexList.push({ k: userSexMap[k], v: k })
      }
      this.sexList = sexList
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
      // expert
      ps.type = 'expert'
      return ps
    },
    getList () {
      let ps = this.getParams()
      this.isLoading = true
      let _that = this
      getUserInfolistApi(ps).then(res => {
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
    add () {
      this.$refs.detail.open()
    },
    update (row) {
      this.$refs.detail.open('update', row.id)
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
    },
    ban (row) {
      let _that = this
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定封禁该用户吗？</p>',
        onOk: () => {
          _that.isLoading = true
          banData(row.id).then(res => {
            _that.isLoading = false
            _that.$Message.success('操作成功')
            _that.getList()
          })
        },
        onCancel: () => {

        }
      })
    },
    upgradeToleader (row) {
      this.$Modal.confirm({
        title: '是否升级为团长？',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          UpgradeToleaderApi({ id: row.id }).then(() => {
            this.$Message.info('升级成功')
            this.getList()
          })
        },
        onCancel: () => {
          this.$Message.info('取消')
        }
      })
    },
    cancelCommander (row) {
      this.$Modal.confirm({
        title: '是否撤销团长？',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          cancelCommanderApi({ id: row.id }).then(() => {
            this.$Message.info('撤销成功')
            this.getList()
          })
        },
        onCancel: () => {
          this.$Message.info('取消')
        }
      })
    }
  }
}
</script>
