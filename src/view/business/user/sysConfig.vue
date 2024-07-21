<style lang="less">
  @import './user.less';
</style>
<template>
    <div class="sys-info">
        <Row :gutter="rowGutter">
            <Col span="12">
                <div class="spin-module" v-if="cashLoading">
                    <Spin fix></Spin>
                </div>
                <Card :bordered="true" class="config-height">
                    <p slot="title">提现配置</p>
                    <p>
                        <Form ref="cashForm" :model="cashForm" :label-width="labelWidth" :rules="cashRules" inline>
                            <Row :gutter="rowGutter">
                                <Col span="12">
                                    <FormItem prop="cashTime" label="提现日期">
                                        <Input type="text" v-model="cashForm.cashTime" placeholder="可提现日期（例子：1，15就是1日和15日）">
                                            <Icon type="ios-analytics" slot="prepend"></Icon>
                                        </Input>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem prop="monthCashTime" label="次月生效日期">
                                        <Input type="text" v-model="cashForm.monthCashTime" placeholder="次月可提现金额生效日期（填写15即为次月15日）">
                                            <Icon type="ios-analytics" slot="prepend"></Icon>
                                        </Input>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row :gutter="rowGutter" class="el-center">
                                <FormItem>
                                    <Button type="primary" class="mg-btn" @click="submitCash">保存配置</Button>
                                </FormItem>
                            </Row>
                        </Form>
                    </p>
                </Card>
            </Col>
            <Col span="12">
                <div class="spin-module" v-if="vipLoading">
                    <Spin fix></Spin>
                </div>
                <Card :bordered="true" class="config-height">
                    <p slot="title">会员业务配置</p>
                    <p>
                        <Form ref="vipForm" :model="vipForm" :label-width="labelWidth" :rules="vipRules" inline>
                            <Row :gutter="rowGutter">
                                <Col span="12" v-for="item,i in vipList">
                                    <FormItem :prop="item.codeTf" :label="item.name">
                                        <Input type="number" v-model="vipForm[item.codeTf]" :placeholder="item.name">
                                            <Icon type="ios-analytics" slot="prepend"></Icon>
                                        </Input>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row :gutter="rowGutter" class="el-center">
                                <FormItem>
                                    <Button type="primary" class="mg-btn" @click="submitVip">保存配置</Button>
                                </FormItem>
                            </Row>
                        </Form>
                    </p>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top10" :gutter="rowGutter">
            <Col span="12">
                <div class="spin-module" v-if="shareLoading">
                    <Spin fix></Spin>
                </div>
                <Card :bordered="true" class="config-height">
                    <p slot="title">分红配置</p>
                    <p>
                        <Form ref="shareForm" :model="shareForm" :label-width="labelWidth" :rules="shareRules" inline>
                            <Row :gutter="rowGutter">
                                <Col span="12">
                                    <FormItem prop="shareVideoPlat" label="平台比例（视频）">
                                        <Input type="text" v-model="shareForm.shareVideoPlat" placeholder="平台比例（视频）">
                                            <Icon type="ios-analytics" slot="prepend"></Icon>
                                        </Input>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem prop="shareVideoPub" label="推广比例（视频）">
                                        <Input type="text" v-model="shareForm.shareVideoPub" placeholder="推广比例（视频）">
                                            <Icon type="ios-analytics" slot="prepend"></Icon>
                                        </Input>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row :gutter="rowGutter">
                                <Col span="12">
                                    <FormItem prop="shareEvipPlat" label="平台比例（专属）">
                                        <Input type="text" v-model="shareForm.shareVipPlat" placeholder="平台比例（专属）">
                                            <Icon type="ios-analytics" slot="prepend"></Icon>
                                        </Input>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem prop="shareEvipPub" label="推广比例（专属）">
                                        <Input type="text" v-model="shareForm.shareVipPub" placeholder="推广比例（专属）">
                                            <Icon type="ios-analytics" slot="prepend"></Icon>
                                        </Input>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row :gutter="rowGutter" class="el-center">
                                <FormItem>
                                    <Button type="primary" class="mg-btn" @click="submitShare">保存配置</Button>
                                </FormItem>
                            </Row>
                        </Form>
                    </p>
                </Card>
            </Col>
            <Col span="12">
                <div class="spin-module" v-if="sysLoading">
                    <Spin fix></Spin>
                </div>
                <Card :bordered="true" class="config-height">
                    <p slot="title">系统配置</p>
                    <p>
                        <Form ref="sysForm" :model="sysForm" :label-width="labelWidth" :rules="sysRules" inline>
                            <Row :gutter="rowGutter">
                                <Col span="12">
                                    <FormItem prop="whsj" label="维护时间">
                                        <DatePicker type="datetimerange" placeholder="请选择" v-model="timeWh" @on-ok="selectTimeWh()" @on-clear="clearTimeWh()"></DatePicker>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row :gutter="rowGutter" class="el-center">
                                <FormItem>
                                    <Button type="primary" class="mg-btn" @click="submitSys">保存配置</Button>
                                </FormItem>
                            </Row>
                        </Form>
                    </p>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
import { getAllConfig,updateAllConfig } from '@/api/gconfig';
import { getVipConfig,updateVipConfig } from '@/api/vip';
import { checkTxt,checkTxtDef,timeFmt,checkFieldReqs } from "@/libs/util"
export default {
  name: 'sysConfig',
  components: {

  },
  props: {
    
  },
  data() {
    return {
        authMap: {},
        rowGutter: 10,
        labelWidth: 120,
        cashForm: {},
        cashRules: {
            cashTime: [
                { required: true, message: '请填写可提现日期', trigger: 'blur' }
            ],
            monthCashTime: [
                { required: true, message: '请填写次月生效日期', trigger: 'blur' }
            ],
        },
        cashLoading: false,
        vipList: [],
        vipForm: {},
        vipRules: {
            
        },
        vipMap: {},
        vipLoading: false,
        shareForm: {},
        shareRules: {
            
        },
        shareLoading: false,
        sysForm: {},
        sysRules: {
            
        },
        sysLoading: false,
        timeWh: [],
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
      this.getData()
      this.getVipData()
    },
    getData() {
        let _that = this
        _that.cashLoading = true
        _that.shareLoading = true
        _that.sysLoading = true
        getAllConfig().then(res => {
            let d = res.data
            _that.cashForm = { cashTime:d.cashTime,monthCashTime:d.monthCashTime }
            _that.shareForm = { shareVideoPlat:d.shareVideoPlat,shareVideoPub:d.shareVideoPub,shareVipPlat:d.shareVipPlat,shareVipPub:d.shareVipPub }
            if (checkTxt(d.platWh)) {
                let platWh = d.platWh
                let pws = platWh.split("-")
                _that.timeWh = [timeFmt(parseInt(pws[0])),timeFmt(parseInt(pws[1]))]
            }
            _that.cashLoading = false
            _that.shareLoading = false
            _that.sysLoading = false
        })
    },
    getVipData() {
        let _that = this
        _that.vipLoading = true
        getVipConfig().then(res => {
            let d = res.data
            _that.vipList = d
            let nMap = {}
            for (let i = 0; i < d.length; i++) {
                const iObj = d[i];
                nMap[iObj.codeTf] = iObj.id
                _that.vipForm[iObj.codeTf] = iObj.money
            }
            _that.vipMap = nMap
            _that.vipLoading = false
        })
    },
    selectTimeWh() {
        let ts = this.timeWh
        if (ts && ts.length > 0) {
            this.sysForm.whkssj = parseInt(ts[0].getTime())
            this.sysForm.whjssj = parseInt(ts[1].getTime())
        }
    },
    clearTimeWh() {
        this.sysForm.whkssj = null
        this.sysForm.whjssj = null
    },
    submitSys() {
        let _that = this
        this.$refs['sysForm'].validate((valid) => {
            if (valid) {
                _that.sysLoading = true
                let d = {}
                if (_that.sysForm.whkssj) {
                    d.platWh = `${_that.sysForm.whkssj}-${_that.sysForm.whjssj}`
                } else {
                    d.platWh = ``
                }
                updateAllConfig(d).then(res => {
                    _that.sysLoading = false
                    _that.$Message.success("修改成功")
                    _that.getData()
                })
            } else {
                this.$Message.error('请填写提现配置的必要信息');
            }
        })
    },
    submitCash() {
        let _that = this
        this.$refs['cashForm'].validate((valid) => {
            if (valid) {
                _that.cashLoading = true
                let d = _that.cashForm
                updateAllConfig(d).then(res => {
                    _that.cashLoading = false
                    _that.$Message.success("修改成功")
                    _that.getData()
                })
            } else {
                this.$Message.error('请填写提现配置的必要信息');
            }
        })
    },
    submitVip() {
        let _that = this
        this.$refs['vipForm'].validate((valid) => {
            if (valid) {
                _that.vipLoading = true
                let d = _that.vipForm
                let dList = []
                for (let k in d) {
                    let id = _that.vipMap[k]
                    let v = d[k]
                    dList.push({ id:id,money:v })
                }
                updateVipConfig(dList).then(res => {
                    _that.vipLoading = false
                    _that.$Message.success("修改成功")
                    _that.getVipData()
                })
            } else {
                this.$Message.error('请填写VIP配置的必要信息');
            }
        })
    },
    submitShare() {
        let _that = this
        this.$refs['shareForm'].validate((valid) => {
            if (valid) {
                let d = _that.shareForm
                _that.shareLoading = true
                updateAllConfig(d).then(res => {
                _that.shareLoading = false
                    _that.$Message.success("修改成功")
                    _that.getData()
                })
            } else {
                this.$Message.error('请填写分红配置的必要信息');
            }
        })
    },
  },
};
</script>