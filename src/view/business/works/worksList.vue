<style lang="less">
@import "./works.less";
</style>
<template>
    <div class="user-list">
        <Card :bordered="true">
            <Row :gutter="rowGutter">
                <Form ref="searchForm" :model="searchForm" :rules="searchRules" inline>
                    <FormItem prop="code">
                        <Input type="text" v-model="searchForm.code" placeholder="作品编号">
                            <Icon type="ios-color-filter" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="title">
                        <Input type="text" v-model="searchForm.title" placeholder="作品名称">
                            <Icon type="ios-color-filter" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="type">
                        <Select v-model="searchForm.type" :style="selectStyle" placeholder="作品类型">
                            <Option v-for="item,i in typeList" :value="item.v">{{ item.k }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="status">
                        <Select v-model="searchForm.status" :style="selectStyle" placeholder="作品状态">
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
                <Button type="primary" class="mg-btn" @click="back" v-if="pid != null"><Icon type="ios-arrow-back" size="16" /> 返回{{ `（${pName}）` }}</Button>
                <Button type="primary" class="mg-btn" @click="add('video')" v-if="authMap['worksAddVideo']"><Icon type="md-videocam" size="16" /> 发布视频</Button>
                <Button type="warning" class="mg-btn" @click="add('folder')" v-if="pid == null && authMap['worksAddFolder']"><Icon type="md-folder" size="16" /> 创建合集</Button>
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
        <worksEdit ref="worksEdit" @lastLoad="searchData"></worksEdit>
        <worksDetail ref="worksDetail"></worksDetail>
    </div>
</template>
<script>
import imgIcon from "@/assets/images/icon/img.png"
import { pageData,delData,upVideoApi,downVideoApi } from "@/api/works";
import { checkTxt,checkTxtDef,timeFmt,checkFieldReqs } from "@/libs/util"
import { worksTypeMap,worksStatusMap } from "@/libs/dict"
import worksEdit from "./worksEdit.vue";
import worksDetail from "./worksDetail.vue";
export default {
  name: 'works-list',
  components: {
    worksEdit,worksDetail
  },
  props: {
    
  },
  data() {
    return {
        checkTxt,checkTxtDef,timeFmt,imgIcon,
        worksTypeMap,
        worksStatusMap,
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
        pid: null,
        pName: '',
        searchRules: {
            
        },
        columns: [
            {
                fixed: 'left',
                title: '作品封面',
                key: 'coverImg',
                width: 100,
                render: (h, params) => {
                    let d = params.row
                    let url = d.coverImg?d.coverImg:imgIcon
                    return h("div", { attrs:{class: "table-img"} },[h('img', { attrs:{ src:url } } ,'')]);
                }
            },
            {
                fixed: 'left',
                title: '作品编号',
                key: 'code',
                tooltip: true,
                width: 180
            },
            {
                fixed: 'left',
                title: '作品名称',
                key: 'title',
                tooltip: true,
                width: 150,
                render: (h, params) => {
                    let d = params.row
                    let v = d.title?d.title:'未命名'
                    let color = 'black'
                    let otxt = ``
                    if (d.type == 'folder') {
                        color = 'orange'
                        otxt = `（${d.num?d.num:0}）`
                        return h("div",{ style:{ color:color,cursor:"pointer" },on:{ click:() => { this.clickFolder(d) } } }, `${v}${otxt}`);
                    }
                    return h("div",{ style:{ color:color } }, `${v}${otxt}`);
                }
            },
            {
                title: '视频时长',
                key: 'playTime',
                width: 100,
                render: (h, params) => {
                    let d = params.row
                    return h("div", `${checkTxtDef(d.playTime,'0')}秒`);
                }
            },
            {
                title: '视频播放量',
                width: 100,
                key: 'playCount'
            },
            {
                title: '视频购买量',
                width: 100,
                key: 'playBuy'
            },
            {
                title: '价格',
                key: 'money',
                width: 80,
                render: (h, params) => {
                    let d = params.row
                    return h("div", `${checkTxtDef(d.money,'0')}元`);
                }
            },
            {
                title: '集数',
                key: 'collNum',
                width: 120,
                render: (h, params) => {
                    let d = params.row
                    return h("div", `第${checkTxtDef(d.collNum,'0')}集`);
                }
            },
            {
                title: '购买后观看时长',
                key: 'useTime',
                width: 150,
                render: (h, params) => {
                    let d = params.row
                    let v = d.useTime?d.useTime:'0'
                    return h("div", `${v}小时`);
                }
            },
            {
                title: '类型',
                key: 'type',
                width: 100,
                render: (h, params) => {
                    let d = params.row
                    let dict = worksTypeMap
                    let v = checkTxtDef(d.type,"")
                    let sv = dict[v]
                    sv = sv==null?{v:"未定义",c:"red"}:sv
                    return h('Tag', { props: { color:sv.c } } , sv.v);
                }
            },
            {
                title: '状态',
                key: 'status',
                width: 120,
                render: (h, params) => {
                    let d = params.row
                    let dict = worksStatusMap
                    let v = checkTxtDef(d.status,"")
                    let sv = dict[v]
                    sv = sv==null?{v:"未定义",c:"error"}:sv
                    return h('Tag', { props: { color:sv.c } } , sv.v);
                }
            },
            {
                title: '创建时间',
                key: 'type',
                width: 160,
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
                                display: row.type=='video'&&[3,4,5].includes(row.status)?'':'none'
                            },
                            on: {
                                click: () => {
                                    this.upVideo(row)
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
                                display: row.type=='video'&&[1].includes(row.status)?'':'none'
                            },
                            on: {
                                click: () => {
                                    this.downVideo(row)
                                }
                            }
                        }, '下架'),
                        h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px',
                                display: row.type=='video'?'':'none'
                            },
                            on: {
                                click: () => {
                                    this.info(row)
                                }
                            }
                        }, '详情'),
                        h('Button', {
                            props: {
                                type: 'warning',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px',
                                display: ![2].includes(row.status)?'':'none'
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
                                display: ![2].includes(row.status)?'':'none'
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
        statusList: [],
        authMap: {},
    };
  },
  computed: {
    
  },
  created() {},
  mounted() {
    this.authMap = this.$store.state.user.userInfo.authMap
    this.init();
  },
  methods: {
    init() {
      this.initDictData()
      this.getList()
    },
    initDictData() {
        let typeList = []
        for (let k in worksTypeMap) {
            typeList.push({ k: worksTypeMap[k].v,v: k })
        }
        this.typeList = typeList
        let statusList = []
        for (let k in worksStatusMap) {
            statusList.push({ k: worksStatusMap[k].v,v: k })
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
        if (this.pid) {
            sf.pid = this.pid
        } else {
            sf.pid = null
        }
        for (let k in sf) {
            if ( checkTxt(sf[k]) ) ps[k] = sf[k];
        }
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
        this.pid = null
        this.pName = ''
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
    upVideo(row) {
        let _that = this
        this.$Modal.confirm({
            title: '提示',
            content: '<p>确定申请上架该视频吗？</p>',
            onOk: () => {
                _that.isLoading = true
                upVideoApi(row.id).then(res => {
                    _that.isLoading = false
                    _that.$Message.success("申请上架成功，请耐心等待管理员审核")
                    _that.getList()
                })
            },
            onCancel: () => {
                
            }
        });
    },
    downVideo(row) {
        let _that = this
        this.$Modal.confirm({
            title: '提示',
            content: '<p>确定下架该视频吗？</p>',
            onOk: () => {
                _that.isLoading = true
                downVideoApi(row.id).then(res => {
                    _that.isLoading = false
                    _that.$Message.success("下架成功")
                    _that.getList()
                })
            },
            onCancel: () => {
                
            }
        });
    },
    clickFolder(row) {
        this.pid = row.id
        this.pName = row.title
        this.searchData()
    },
    back() {
        this.pid = null
        this.pName = ''
        this.searchData()
    },
    add(dt) {
        this.$refs.worksEdit.open(dt,'add',null,this.pid)
    },
    update(row) {
        this.$refs.worksEdit.open(row.type,'update',row.id,this.pid)
    },
    info(row) {
        this.$refs.worksDetail.open(row.id)
    },
    del(row) {
        let _that = this
        this.$Modal.confirm({
            title: '提示',
            content: '<p>确定删除该用户吗？</p>',
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
  },
};
</script>