<style lang="less" scoped>
.order-detail {
    .order-content {
      height: 100%;
      width: 100%;
      line-height: 3;
    }
}
</style>
<template>
    <Modal class="order-detail" v-model="modalShow" :title="modalTitle" width="800" :styles="{ top:'20px' }">
      <Card class="order-content" :bordered="true">
          <p slot="title">订单信息（{{ checkTxtDef(dataForm.code) }}）</p>
          <Row :gutter="rowGutter">
            <Col span="24">
              订单名称：{{ checkTxtDef(dataForm.name) }}
            </Col>
            <Col span="24">
                订单内容：{{ checkTxtDef(dataForm.info) }}
            </Col>
            <Col span="8">
                订单类型：<Tag v-if="dataForm.type" :color="orderTypeMap[dataForm.type].c">{{ orderTypeMap[dataForm.type].v }}</Tag>
            </Col>
            <Col span="8">
                支付方式：<Tag v-if="dataForm.payType" :color="orderPayTypeMap[dataForm.payType].c">{{ orderPayTypeMap[dataForm.payType].v }}</Tag>
            </Col>
            <Col span="8">
                订单状态：<Tag  v-if="dataForm.status":color="orderStatusMap[dataForm.status].c">{{ orderStatusMap[dataForm.status].v }}</Tag>
            </Col>
            <Col span="8">
                订单金额：<span class="text-blue">{{ checkTxtDef(dataForm.money,'0') }}</span> 元
            </Col>
            <Col span="8">
                分红：<span class="text-blue">{{ checkTxtDef(dataForm.shareMoney,'0') }}</span> 元
            </Col>
            <Col span="8">
                所得收益：<span class="text-red">{{ checkTxtDef(dataForm.incomeMoney,'0') }}</span> 元
            </Col>
            <Col span="8" v-if="dataForm.createTime">
                创建时间：{{ timeFmt(dataForm.createTime) }}
            </Col>
            <Col span="8" v-if="dataForm.payTime">
                支付时间：{{ timeFmt(dataForm.payTime) }}
            </Col>
            <Col span="8" v-if="dataForm.refundTime">
                退款时间：{{ timeFmt(dataForm.refundTime) }}
            </Col>
            <Col span="8" v-if="dataForm.cancelTime">
                取消时间：{{ timeFmt(dataForm.cancelTime) }}
            </Col>
            <Col span="8" v-if="dataForm.comTime">
                完成时间：{{ timeFmt(dataForm.comTime) }}
            </Col>
          </Row>
          <Divider orientation="left">用户数据</Divider>
          <Row :gutter="rowGutter" v-if="dataForm.user">
            <Col span="24">
              用户昵称：{{ `${checkTxtDef(dataForm.user.nickname)}（${checkTxtDef(dataForm.user.account)}）` }}
            </Col>
            <Col span="8">
                电话号码：{{ checkTxtDef(dataForm.user.phone) }}
            </Col>
            <Col span="16">
                简介：{{ checkTxtDef(dataForm.user.info) }}
            </Col>
          </Row>
          <template v-if="dataForm.type != null && dataForm.type == 'works'">
            <Divider orientation="left">视频信息</Divider>
            <Row :gutter="rowGutter" v-if="dataForm.video">
              <Col span="24">
                视频名称：{{ `${checkTxtDef(dataForm.video.title)}（${checkTxtDef(dataForm.video.code)}）` }}
              </Col>
              <Col span="8">
                  视频播放量：{{ checkTxtDef(dataForm.video.playCount) }}
              </Col>
              <Col span="8">
                  视频购买量：{{ checkTxtDef(dataForm.video.playBuy) }}
              </Col>
              <Col span="8">
                  视频时长：{{ checkTxtDef(dataForm.video.playTime) }}
              </Col>
              <Col span="24">
                  简介：{{ checkTxtDef(dataForm.video.info) }}
              </Col>
            </Row>
          </template>
          <template v-if="dataForm.type != null && dataForm.type == 'vip'">
            <Divider orientation="left">VIP信息</Divider>
            <Row :gutter="rowGutter" v-if="dataForm.vip">
              <Col span="24">
                会员名称：{{ `${checkTxtDef(dataForm.vip.name)}` }}
              </Col>
              <Col span="8">
                  会员时间：{{ checkTxtDef(dataForm.vip.useDay) }} 天
              </Col>
              <Col span="8">
                  会员价格：{{ checkTxtDef(dataForm.vip.money) }} 元
              </Col>
              <Col span="8">
                  会员类型：<Tag :color="vipTypeMap[dataForm.vip.type].c">{{ vipTypeMap[dataForm.vip.type].v }}</Tag>
              </Col>
              <Col span="24">
                  会员特权介绍：{{ checkTxtDef(dataForm.vip.info) }}
              </Col>
            </Row>
          </template>
        </Card>
        <div slot="footer">
            <Button size="large" @click="moduleClose">关闭</Button>
        </div>
    </Modal>
</template>
<script>
import { infoData } from "@/api/order"
import { checkTxt,checkTxtDef,timeFmt } from "@/libs/util"
import { orderTypeMap,orderPayTypeMap,orderStatusMap,vipTypeMap } from "@/libs/dict"
export default {
  name: '',
  components: {

  },
  props: {
    
  },
  data() {
    return {
        checkTxt,checkTxtDef,timeFmt,orderTypeMap,orderPayTypeMap,orderStatusMap,vipTypeMap,
        modalShow: false,
        modalTitle: "详情",
        rowGutter: 10,
        dataForm: {},
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
      
    },
    open(id) {
        this.modalShow = true
        this.dataForm = {}
        this.getInfo(id)
    },
    getInfo(id) {
        let _that = this
        infoData(id).then(res => {
          let d = res.data
          _that.dataForm = d
        })
    },
    moduleClose() {
        this.modalShow = false
    },
  },
};
</script>