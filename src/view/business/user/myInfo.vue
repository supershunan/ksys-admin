<style lang="less">
  @import './user.less';
</style>
<template>
    <div class="my-info">
        <Card :bordered="true">
            <div class="spin-module" v-if="myInfoLoading">
                <Spin fix></Spin>
            </div>
            <p slot="title">个人信息</p>
            <p>
                <Row :gutter="rowGutter">
                    <Col span="16">
                        <Divider orientation="left">我的信息</Divider>
                        <Row :gutter="rowGutter">
                            <Col span="6">
                                <div class="my-avatar el-center-list">
                                    <UploadFile ref="avatarUpload" item="ksys" module="user" type="imgSing" :size="100"
                                    @fileResult="myInfoAvatarSave"></UploadFile>
                                </div>
                            </Col>
                            <Col span="18" v-if="!isUpdateInfo">
                                <div class="my-item">
                                    <div class="my-label">账号：</div>
                                    <div class="my-content">
                                        {{ checkTxtDef(myInfo.account) }}
                                    </div>
                                </div>
                                <div class="my-item">
                                    <div class="my-label">昵称：</div>
                                    <div class="my-content">
                                        {{ checkTxtDef(myInfo.nickname) }}
                                    </div>
                                </div>
                                <div class="my-item">
                                    <div class="my-label">性别：</div>
                                    <div class="my-content">
                                        {{ myInfo.sex?userSexMap[myInfo.sex]:'-/-' }}
                                    </div>
                                </div>
                            </Col>
                            <Col span="18" v-else>
                                <div class="my-item">
                                    <div class="my-label">账号：</div>
                                    <div class="my-content">
                                        <Input type="text" v-model="myInfoForm.account" placeholder="账号">
                                            <Icon type="ios-analytics" slot="prepend"></Icon>
                                        </Input>
                                    </div>
                                </div>
                                <div class="my-item">
                                    <div class="my-label red-star">昵称：</div>
                                    <div class="my-content">
                                        <Input type="text" v-model="myInfoForm.nickname" placeholder="昵称">
                                            <Icon type="ios-analytics" slot="prepend"></Icon>
                                        </Input>
                                    </div>
                                </div>
                                <div class="my-item">
                                    <div class="my-label red-star">性别：</div>
                                    <div class="my-content">
                                        <Select v-model="myInfoForm.sex" style="width: 200px;">
                                            <Option v-for="item,i in sexList" :value="item.v">{{ item.k }}</Option>
                                        </Select>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row :gutter="rowGutter" class="margin-top10">
                            <Col span="8">
                                <div class="my-item" v-if="!isUpdateInfo">
                                    <div class="my-label">电话号码：</div>
                                    <div class="my-content">
                                        {{ checkTxtDef(myInfo.phone) }}
                                    </div>
                                </div>
                                <div class="my-item" v-else>
                                    <div class="my-label">电话号码：</div>
                                    <div class="my-content">
                                        <Input type="phone" v-model="myInfoForm.phone" placeholder="电话号码">
                                            <Icon type="ios-analytics" slot="prepend"></Icon>
                                        </Input>
                                    </div>
                                </div>
                            </Col>
                            <Col span="16">
                                <div class="my-item">
                                    <div class="my-label">注册时间：</div>
                                    <div class="my-content">
                                        {{ timeFmt(myInfo.createTime) }}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row :gutter="rowGutter" class="margin-top10">
                            <Col span="24">
                                <div class="my-item" v-if="!isUpdateInfo">
                                    <div class="my-label">地址：</div>
                                    <div class="my-content">
                                        {{ checkTxtDef(myInfo.address) }}
                                    </div>
                                </div>
                                <div class="my-item" v-else>
                                    <div class="my-label">地址：</div>
                                    <div class="my-content">
                                        <Input type="text" v-model="myInfoForm.address" placeholder="地址">
                                            <Icon type="ios-analytics" slot="prepend"></Icon>
                                        </Input>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row :gutter="rowGutter">
                            <Col span="24">
                                <div class="my-item" v-if="!isUpdateInfo">
                                    <div class="my-label">个人简介：</div>
                                    <div class="my-content">
                                        {{ checkTxtDef(myInfo.info) }}
                                    </div>
                                </div>
                                <div class="my-item" v-else>
                                    <div class="my-label red-star">个人简介：</div>
                                    <div class="my-content">
                                        <Input v-model="myInfoForm.info" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="个人简介"></Input>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row :gutter="rowGutter">
                            <div class="my-item el-center">
                                <Button class="my-btn" type="primary" @click="myShareUrl" v-if="authMap['shareUrl']">查看邀请链接</Button>
                                <Button class="my-btn" type="warning" v-if="!isUpdateInfo" @click="myInfoUpdate">编辑</Button>
                                <Button class="my-btn" type="info" v-if="isUpdateInfo" @click="myInfoSave">保存</Button>
                                <Button class="my-btn" v-if="isUpdateInfo" @click="myInfoCancel">取消</Button>
                            </div>
                        </Row>
                    </Col>
                    <Col span="8">
                        <Divider orientation="left">我的余额</Divider>
                        <Row :gutter="rowGutter">
                            <Col span="24" v-if="isApplyCash">
                                <div class="my-item">
                                    <div class="my-label red-star">提现金额：</div>
                                    <div class="my-content">
                                        <Input type="number" v-model="cashForm.money" placeholder="提现金额">
                                            <Icon type="ios-analytics" slot="prepend"></Icon>
                                        </Input>
                                    </div>
                                </div>
                            </Col>
                            <Col span="24">
                                <div class="my-item">
                                    <div class="my-label">当前余额：</div>
                                    <div class="my-content">
                                        <span class="text-blue">{{ checkTxtDef(myInfo.money) }}</span> 元
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row :gutter="rowGutter">
                            <div class="my-item el-center">
                                <Button class="my-btn" type="info" v-if="!isApplyCash && authMap['applyCash']" @click="applyCashSet">申请提现</Button>
                                <Button class="my-btn" type="info" v-if="isApplyCash" @click="applyCashSave">提交</Button>
                                <Button class="my-btn" v-if="isApplyCash" @click="applyCashCancel">取消</Button>
                            </div>
                        </Row>
                        <Divider orientation="left">管理密码</Divider>
                        <Row :gutter="rowGutter">
                            <Col span="24" v-if="!isUpdatePwd">
                                <div class="my-item">
                                    <div class="my-label">我的密码：</div>
                                    <div class="my-content">
                                        *********
                                    </div>
                                </div>
                            </Col>
                            <Col span="24" v-if="isUpdatePwd">
                                <div class="my-item">
                                    <div class="my-label red-star">新的密码：</div>
                                    <div class="my-content">
                                        <Input type="password" v-model="pwdForm.newPwd" placeholder="新的密码">
                                            <Icon type="ios-analytics" slot="prepend"></Icon>
                                        </Input>
                                    </div>
                                </div>
                                <div class="my-item">
                                    <div class="my-label red-star">确认密码：</div>
                                    <div class="my-content">
                                        <Input type="password" v-model="pwdForm.againPwd" placeholder="确认密码">
                                            <Icon type="ios-analytics" slot="prepend"></Icon>
                                        </Input>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row :gutter="rowGutter">
                            <div class="my-item el-center">
                                <Button class="my-btn" type="warning" v-if="!isUpdatePwd" @click="updatePwdSet">修改密码</Button>
                                <Button class="my-btn" type="info" v-if="isUpdatePwd" @click="updatePwdSave">保存</Button>
                                <Button class="my-btn" v-if="isUpdatePwd" @click="updatePwdCancel">取消</Button>
                            </div>
                        </Row>
                    </Col>
                </Row>
            </p>
        </Card>
        <Card class="margin-top10" :bordered="true" v-if="authMap['myApply']">
            <p slot="title">我的申请</p>
            <p>
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
                        <FormItem>
                            <Button type="primary" class="my-search-btn" @click="searchData">查询</Button>
                            <Button class="my-search-btn" @click="resetData">重置</Button>
                        </FormItem>
                    </Form>
                </Row>
                <Row :gutter="rowGutter">
                    <Table border :columns="columns" :data="datas" :loading="isLoading"></Table>
                </Row>
                <Row :gutter="rowGutter" class="margin-top10">
                    <Page :current="pageData.page" :page-size="pageData.rows" :total="pageData.total" @on-change="pageChange" 
                    :page-size-opts="pageOpts" @on-page-size-change="pageOptChange"
                    show-sizer show-elevator show-total />
                </Row>
            </p>
        </Card>
        <mediaSee ref="mediaSee"></mediaSee>
    </div>
</template>
<script>
import { pageData,submitCashData } from "@/api/apply"
import { getMyInfo,updateMyInfo,updatePwd,shareUrlData } from "@/api/user"
import { checkTxt,checkTxtDef,timeFmt,checkFieldReqs } from "@/libs/util"
import { applyTypeMap,applyStatusMap,userSexMap } from "@/libs/dict"
import md5 from 'js-md5'
import UploadFile from "_c/upload/uploadFile.vue"
export default {
  name: 'myInfo',
  components: {
    UploadFile
  },
  props: {
    
  },
  data() {
    return {
        checkTxt,
        checkTxtDef,
        timeFmt,
        userSexMap,
        pageData: {
            page: 1,
            rows: 10,
            total: 0
        },
        pageOpts: [10,20,50,100],
        isLoading: false,
        rowGutter: 10,
        searchForm: {},
        searchRules: {
            
        },
        columns: [
            {
                title: '申请编号',
                key: 'code'
            },
            {
                title: '申请名称',
                key: 'name'
            },
            {
                title: '申请内容',
                key: 'info',
                width: 400,
            },
            {
                title: '申请类型',
                key: 'type',
                render: (h, params) => {
                    let d = params.row
                    let dict = applyTypeMap
                    let v = checkTxtDef(d.type,"")
                    let sv = dict[v]
                    sv = checkTxtDef(sv,"未定义类型")
                    return h('div', sv);
                }
            },
            {
                title: '申请状态',
                key: 'type',
                render: (h, params) => {
                    let d = params.row
                    let dict = applyStatusMap
                    let v = checkTxtDef(d.status,"")
                    let sv = dict[v]
                    sv = sv==null?{v:"未定义",c:"error"}:sv
                    return h('Tag', { props: { color:sv.c } } , sv.v);
                }
            },
            {
                title: '申请时间',
                key: 'type',
                render: (h, params) => {
                    let d = params.row
                    let txt = timeFmt(d.createTime)
                    return h('div', txt);
                }
            }
        ],
        datas: [],
        sexList: [],
        isUpdateInfo: false,
        isUpdatePwd: false,
        isApplyCash: false,
        myInfo: {},
        myInfoForm: {},
        pwdForm: {},
        cashForm: {},
        myInfoLoading: false,
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
        this.getMy()
        this.getList()
    },
    initDictData() {
        let nList = []
        for (let k in userSexMap) {
            nList.push({ k: userSexMap[k],v: k })
        }
        this.sexList = nList
    },
    getMy() {
        let _that = this
        _that.myInfoLoading = true
        getMyInfo().then(res => {
            _that.myInfo = res.data
            _that.$refs.avatarUpload.setVal(_that.myInfo.avatar)
            _that.myInfoLoading = false
        })
    },
    getParams() {
        let pd = this.pageData
        let ps = {
            page: pd.page,
            rows: pd.rows
        }
        let { code,name } = this.searchForm
        if ( checkTxt(code) ) ps.code = code;
        if ( checkTxt(name) ) ps.name = name;
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
    myInfoUpdate() {
        this.myInfoForm = {...this.myInfo}
        this.myInfoForm.sex = this.myInfoForm.sex+''
        this.isUpdateInfo = true
    },
    myInfoAvatarSave(d) {
        this.myInfoSaveForm({ avatar:d })
    },
    myInfoSave() {
        let _that = this
        let d = this.myInfoForm
        let fs = [ {f:'account',m:'账号'},{f:'nickname',m:'昵称'},{f:'sex',m:'性别'},{f:'info',m:'个人简介'} ]
        if (!checkFieldReqs(d,fs)) {
            return
        }
        this.myInfoSaveForm(d)
    },
    myInfoSaveForm(d) {
        let _that = this
        _that.myInfoLoading = true
        updateMyInfo(d).then(res => {
            _that.myInfoLoading = false
            _that.$Message.success("更新成功")
            _that.isUpdateInfo = false
            _that.getMy()
        })
    },
    myInfoCancel() {
        this.isUpdateInfo = false
    },
    applyCashSet() {
        this.cashForm.money = 0
        this.isApplyCash = true
    },
    applyCashSave() {
        let _that = this
        let d = this.cashForm
        let fs = [ {f:'money',m:'提现金额'} ]
        if (!checkFieldReqs(d,fs)) {
            return
        }
        if (d.money < 10) {
            this.$Message.warning("提现金额不得小于10元")
            return
        }
        _that.myInfoLoading = true
        _that.isLoading = true
        submitCashData(d).then(res => {
            _that.myInfoLoading = false
            _that.isLoading = false
            _that.$Message.success("提交申请成功")
            _that.isApplyCash = false
            _that.getMy()
            _that.getList()
        })
    },
    applyCashCancel() {
        this.isApplyCash = false
    },
    updatePwdSet() {
        this.pwdForm = { newPwd:'',againPwd:'' }
        this.isUpdatePwd = true
    },
    updatePwdSave() {
        let _that = this
        let d = this.pwdForm
        let fs = [ {f:'newPwd',m:'新的密码'},{f:'againPwd',m:'确认的密码'} ]
        if (!checkFieldReqs(d,fs)) {
            return
        }
        if (d.newPwd != d.againPwd) {
            this.$Message.warning("两次输入的密码不一致，请确认")
            return
        }
        let sd = { password:md5(d.againPwd) }
        _that.myInfoLoading = true
        updatePwd(sd).then(res => {
            _that.myInfoLoading = false
            _that.$Message.success("提交申请成功")
            _that.isUpdatePwd = false
        })
    },
    updatePwdCancel() {
        this.isUpdatePwd = false
    },
    myShareUrl() {
        shareUrlData().then(res => {
            let d = res.data
            this.$Modal.info({
                title: "我的邀请链接",
                width: 600,
                content: d == null ? "未获取成功" : d
            });
        })
    },
  },
};
</script>