<template>
    <div class="sys-info">
        <Row :gutter="rowGutter">
            <Col span="24">
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
    </div>
</template>
<script>
import { getAllConfig } from '@/api/gconfig'
import { getVipConfig, updateVipConfig } from '@/api/vip'
import { checkTxt, timeFmt } from '@/libs/util'
export default {
  name: 'sysConfig',
  components: {

  },
  props: {

  },
  data () {
    return {
      authMap: {},
      rowGutter: 10,
      labelWidth: 120,
      vipList: [],
      vipForm: {},
      vipRules: {

      },
      vipMap: {},
      vipLoading: false
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
      this.getVipData()
    },
    getVipData () {
      let _that = this
      _that.vipLoading = true
      getVipConfig().then(res => {
        let d = res.data
        _that.vipList = d
        let nMap = {}
        for (let i = 0; i < d.length; i++) {
          const iObj = d[i]
          nMap[iObj.codeTf] = iObj.id
          _that.vipForm[iObj.codeTf] = iObj.money
        }
        _that.vipMap = nMap
        _that.vipLoading = false
      })
    },
    submitVip () {
      let _that = this
      this.$refs['vipForm'].validate((valid) => {
        if (valid) {
          _that.vipLoading = true
          let d = _that.vipForm
          let dList = []
          for (let k in d) {
            let id = _that.vipMap[k]
            let v = d[k]
            dList.push({ id: id, money: v })
          }
          updateVipConfig(dList).then(res => {
            _that.vipLoading = false
            _that.$Message.success('修改成功')
            _that.getVipData()
          })
        } else {
          this.$Message.error('请填写VIP配置的必要信息')
        }
      })
    }
  }
}
</script>
<style lang="less">
  @import './user.less';
</style>
