<style lang="less">
@import "./order.less";
</style>
<template>
    <div class="order-list">
        <Card :bordered="true">
            <Row :gutter="rowGutter">
                <Form ref="searchForm" :model="searchForm" :rules="searchRules" inline>
                    <FormItem prop="code">
                        <Input type="text" v-model="searchForm.code" placeholder="订单编号">
                            <Icon type="ios-color-filter" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="name">
                        <Input type="text" v-model="searchForm.name" placeholder="订单名称">
                            <Icon type="ios-color-filter" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="type">
                        <Select v-model="searchForm.type" :style="selectStyle" placeholder="订单类型">
                            <Option v-for="item,i in typeList" :value="item.v">{{ item.k }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="payType">
                        <Select v-model="searchForm.payType" :style="selectStyle" placeholder="支付方式">
                            <Option v-for="item,i in payTypeList" :value="item.v">{{ item.k }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="status">
                        <Select v-model="searchForm.status" :style="selectStyle" placeholder="订单状态">
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
        <orderDetail ref="orderDetail"></orderDetail>
    </div>
</template>
<script>
import { pageData,delData,backData } from "@/api/order";
import { checkTxt,checkTxtDef,timeFmt,checkFieldReqs } from "@/libs/util"
import { orderTypeMap,orderPayTypeMap,orderStatusMap } from "@/libs/dict"
import orderDetail from "./orderDetail.vue";
export default {
  name: 'user-list',
  components: {
    orderDetail
  },
  props: {
    
  },
  data() {
    return {
        checkTxt,
        checkTxtDef,
        timeFmt,
        orderTypeMap,
        orderPayTypeMap,
        orderStatusMap,
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
                title: '订单编号',
                key: 'code'
            },
            {
                title: '订单名称',
                key: 'name'
            },
            {
                title: '订单金额',
                key: 'money'
            },
            {
                title: '订单类型',
                key: 'type',
                render: (h, params) => {
                    let d = params.row
                    let dict = orderTypeMap
                    let v = checkTxtDef(d.type,"")
                    let sv = dict[v]
                    sv = sv==null?{v:"未定义",c:"red"}:sv
                    return h('Tag', { props: { color:sv.c } } , sv.v);
                }
            },
            {
                title: '支付类型',
                key: 'payType',
                render: (h, params) => {
                    let d = params.row
                    let dict = orderPayTypeMap
                    let v = checkTxtDef(d.payType,"")
                    let sv = dict[v]
                    sv = sv==null?{v:"未定义",c:"red"}:sv
                    return h('Tag', { props: { color:sv.c } } , sv.v);
                }
            },
            {
                title: '支付时间',
                key: 'payTime',
                render: (h, params) => {
                    let d = params.row
                    let txt = timeFmt(d.payTime)
                    return h('div', txt);
                }
            },
            {
                title: '完成时间',
                key: 'comTime',
                render: (h, params) => {
                    let d = params.row
                    let txt = timeFmt(d.comTime)
                    return h('div', txt);
                }
            },
            {
                title: '订单状态',
                key: 'status',
                render: (h, params) => {
                    let d = params.row
                    let dict = orderStatusMap
                    let v = checkTxtDef(d.status,"")
                    let sv = dict[v]
                    sv = sv==null?{v:"未定义",c:"error"}:sv
                    return h('Tag', { props: { color:sv.c } } , sv.v);
                }
            },
            {
                title: '创建时间',
                key: 'createTime',
                render: (h, params) => {
                    let d = params.row
                    let txt = timeFmt(d.createTime)
                    return h('div', txt);
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
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.info(row)
                                }
                            }
                        }, '查看'),
                        h('Button', {
                            props: {
                                type: 'warning',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px',
                                display: [2,4].includes(row.status)?'':'none'
                            },
                            on: {
                                click: () => {
                                    this.back(row)
                                }
                            }
                        }, '回退'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            style: {
                                display: [1,5,6,99].includes(row.status)?'':'none'
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
        typeList: [],
        payTypeList: [],
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
        let typeList = []
        for (let k in orderTypeMap) {
            typeList.push({ k: orderTypeMap[k].v,v: k })
        }
        this.typeList = typeList
        let payTypeList = []
        for (let k in orderPayTypeMap) {
            payTypeList.push({ k: orderPayTypeMap[k].v,v: k })
        }
        this.payTypeList = payTypeList
        let statusList = []
        for (let k in orderStatusMap) {
            statusList.push({ k: orderStatusMap[k].v,v: k })
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
        // ps.type = "user"
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
    back(row) {
        let _that = this
        this.$Modal.confirm({
            title: '提示',
            content: '<p>该操作会退回用户平台货币，确定回退该订单吗？</p>',
            onOk: () => {
                _that.isLoading = true
                backData(row.id).then(res => {
                    _that.isLoading = false
                    _that.$Message.success("回退成功")
                    _that.getList()
                })
            },
            onCancel: () => {
                
            }
        });
    },
    del(row) {
        let _that = this
        this.$Modal.confirm({
            title: '提示',
            content: '<p>确定删除该订单吗？</p>',
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
    info(row) {
        this.$refs.orderDetail.open(row.id)
    },
  },
};
</script>