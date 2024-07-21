<style lang="less">
@import "./user.less";
</style>
<template>
    <div class="user-list">
        <Card :bordered="true">
            <Row :gutter="rowGutter">
                <Form ref="searchForm" :model="searchForm" :rules="searchRules" inline>
                    <FormItem prop="account">
                        <Input type="text" v-model="searchForm.account" placeholder="推广人账号">
                            <Icon type="ios-color-filter" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="nickname">
                        <Input type="text" v-model="searchForm.nickname" placeholder="推广人昵称">
                            <Icon type="ios-color-filter" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="phone">
                        <Input type="text" v-model="searchForm.phone" placeholder="推广人电话">
                            <Icon type="ios-color-filter" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
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
            <Row :gutter="rowGutter">
                <Button type="primary" class="mg-btn" @click="add">添加</Button>
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
    </div>
</template>
<script>
import { pageData,delData } from "@/api/user";
import { checkTxt,checkTxtDef,timeFmt,checkFieldReqs } from "@/libs/util"
import { userSexMap,userStatusMap } from "@/libs/dict"
import detail from "./pubDetail.vue"
export default {
  name: 'pub-list',
  components: {
    detail
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
                title: '推广人头像',
                key: 'avatar',
                width: 100,
                render: (h, params) => {
                    let d = params.row
                    let url = d.avatar?d.avatar:imgIcon
                    return h("div", { attrs:{class: "table-img"} },[h('img', { attrs:{ src:url } } ,'')]);
                }
            },
            {
                title: '推广人账号',
                key: 'account'
            },
            {
                title: '推广人昵称',
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
                title: '推广人电话',
                key: 'phone'
            },
            {
                title: '推广人余额（元）',
                key: 'money'
            },
            {
                title: '入筑时间',
                key: 'type',
                render: (h, params) => {
                    let d = params.row
                    let txt = timeFmt(d.createTime)
                    return h('div', txt);
                }
            },
            {
                title: '推广人状态',
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
                    ]);
                }
            }
        ],
        datas: [],
        sexList: [],
        statusList: [],
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
      this.initDictData()
      this.getList()
    },
    initDictData() {
        let sexList = []
        for (let k in userSexMap) {
            sexList.push({ k: userSexMap[k],v: k })
        }
        this.sexList = sexList
        let statusList = []
        for (let k in userStatusMap) {
            statusList.push({ k: userStatusMap[k].v,v: k })
        }
        this.statusList = statusList
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
        ps.type = "publicize"
        return ps
    },
    getList() {
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
    add() {
        this.$refs.detail.open()
    },
    update(row) {
        this.$refs.detail.open('update',row.id)
    },
    del(row) {
        let _that = this
        this.$Modal.confirm({
            title: '提示',
            content: '<p>确定删除该推广人吗？</p>',
            onOk: () => {
                _that.isLoading = true
                delData({ ids:row.id }).then(res => {
                    _that.isLoading = false
                    _that.$Message.success("删除成功")
                    _that.getList()
                })
            },
            onCancel: () => {
                
            }
        });
    },
    ban(row) {
        let _that = this
        this.$Modal.confirm({
            title: '提示',
            content: '<p>确定封禁该推广人吗？</p>',
            onOk: () => {
                _that.isLoading = true
                banData(row.id).then(res => {
                    _that.isLoading = false
                    _that.$Message.success("操作成功")
                    _that.getList()
                })
            },
            onCancel: () => {
                
            }
        });
    },
  },
};
</script>