<style lang="less">
@import "./vip.less";
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
        <VipAdd ref="VipAdd" @lastLoad="getList"></VipAdd>
    </div>
</template>
<script>
import { pageVipData } from "@/api/user";
import { checkTxt,checkTxtDef,timeFmt,checkFieldReqs } from "@/libs/util"
import { userSexMap,userVipTypeMap,userStatusMap } from "@/libs/dict"
import VipAdd from "./vipAdd.vue"
export default {
  name: 'evip-list',
  components: {
    VipAdd
  },
  props: {
    
  },
  data() {
    return {
        checkTxt,
        checkTxtDef,
        timeFmt,
        userSexMap,
        userStatusMap,
        pageData: {
            page: 1,
            rows: 10,
            total: 0
        },
        pageOpts: [10,20,50,100],
        isLoading: false,
        rowGutter: 10,
        selectStyle: { width:'189px' },
        searchForm: {},
        searchRules: {
            
        },
        columns: [
            {
                title: '用户账号',
                key: 'account'
            },
            {
                title: '用户昵称',
                key: 'nickname'
            },
            {
                title: '性别',
                key: 'type',
                render: (h, params) => {
                    let d = params.row
                    let dict = userSexMap
                    let v = checkTxtDef(d.sex,"")
                    let sv = dict[v]
                    sv = checkTxtDef(sv,"未定义")
                    return h('div', sv);
                }
            },
            {
                title: '用户电话',
                key: 'phone'
            },
            {
                title: '会员信息',
                key: 'vipType',
                width: 240,
                render: (h, params) => {
                    let d = params.row
                    let hList = []
                    if (d.vipType) {
                        let vipList = d.vipType.split("、")
                        for (let i = 0; i < vipList.length; i++) {
                            const val = vipList[i];
                            let dict = userVipTypeMap
                            let v = checkTxtDef(val,"")
                            let sv = dict[v]
                            sv = sv==null?{v:"未定义",c:"red"}:sv
                            hList.push(h('Tag', { props: { color:sv.c } } , sv.v))
                        }
                    }
                    return h('div', hList);
                }
            },
            {
                title: '会员有效期',
                key: 'type',
                width: 400,
                render: (h, params) => {
                    let d = params.row
                    let hList = []
                    if (d.vip) {
                        let fmt = "yyyy-MM-DD"
                        let v = `${timeFmt(d.vip.startTime,fmt)} ~ ${timeFmt(d.vip.endTime,fmt)}`
                        hList.push(h('Tag', { props:{color:"error"} },v))
                    }
                    return h('div', hList);
                }
            },
            {
                title: '用户状态',
                key: 'vipType',
                render: (h, params) => {
                    let d = params.row
                    let dict = userStatusMap
                    let v = checkTxtDef(d.status,"")
                    let sv = dict[v]
                    sv = sv==null?{v:"未定义",c:"red"}:sv
                    return h('Tag', { props: { color:sv.c } } , sv.v);
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
                                type: 'error',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.addEvipTime(row)
                                }
                            }
                        }, '会员延时'),
                    ]);
                }
            }
        ],
        datas: [],
    };
  },
  computed: {
    
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getList()
    },
    getParams() {
        let pd = this.pageData
        let ps = {
            page: pd.page,
            rows: pd.rows
        }
        let sf = this.searchForm
        for (let k in sf) {
            if ( checkTxt(sf[k]) ) ps[k] = sf[k];
        }
        return ps
    },
    getList() {
        let ps = this.getParams()
        this.isLoading = true
        let _that = this
        pageVipData(ps).then(res => {
            _that.datas = res.rows
            _that.pageData.total = res.total
            _that.isLoading = false
        }).catch(er => {
            _that.isLoading = false
        })
    },
    searchData() {
        this.pageData.page = 1
        this.pageData.total = 0
        this.getList()
    },
    resetData() {
        this.pageData.page = 1
        this.pageData.total = 0
        this.searchForm = {}
        this.getList()
    },
    pageChange(v) {
        this.pageData.page = v
        this.pageData.total = 0
        this.getList()
    },
    pageOptChange(v) {
        this.pageData.page = 1
        this.pageData.rows = v
        this.pageData.total = 0
        this.getList()
    },
    addEvipTime(row) {
        this.$refs.VipAdd.open(row.id)
    },
  },
};
</script>