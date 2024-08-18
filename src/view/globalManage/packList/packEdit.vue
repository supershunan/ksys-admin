<style lang="less" scoped>

</style>
<template>
    <Modal class="pack-edit" v-model="modalShow" :title="modalTitle" width="600" :styles="{ top:'20px' }">
        <Form ref="dataForm" :model="dataForm" :label-width="labelWidth" :rules="dataRules">
            <Divider orientation="left">{{ infoTitle }}</Divider>
            <FormItem prop="code" label="套餐编号" v-if="modalType != 'add'">
                <Input type="text" v-model="dataForm.code" placeholder="请输入" readonly></Input>
            </FormItem>
            <FormItem prop="name" label="套餐名称">
                <Input type="text" v-model="dataForm.name" placeholder="请输入"></Input>
            </FormItem>
            <FormItem prop="info" label="套餐说明">
                <Input v-model="dataForm.info" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="套餐说明"></Input>
            </FormItem>
            <FormItem prop="originMoney" label="原价">
                <Input type="number" v-model="dataForm.originMoney" placeholder="请输入"></Input>
            </FormItem>
            <FormItem prop="money" label="优惠价">
                <Input type="number" v-model="dataForm.money" placeholder="请输入"></Input>
            </FormItem>
            <Row :gutter="rowGutter" v-if="dataType == 'video'">
                <FormItem prop="cVideoList" label="选择视频">
                    <Select v-model="cVideoList" multiple placeholder="选择视频">
                        <Option v-for="v,i in videoList" :value="v.id">{{ v.title }}</Option>
                    </Select>
                </FormItem>
            </Row>
            <Row :gutter="rowGutter" v-else>
                <FormItem prop="res" label="获得平台币">
                    <Input type="number" v-model="dataForm.res" placeholder="请输入"></Input>
                </FormItem>
                <FormItem prop="gifts" label="赠送平台币">
                    <Input type="number" v-model="dataForm.gifts" placeholder="请输入"></Input>
                </FormItem>
            </Row>
            <FormItem prop="sort" label="排序">
                <Input type="number" v-model="dataForm.sort" placeholder="请输入"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button size="large" @click="moduleClose">取消</Button>
            <Button type="primary" size="large" :loading="modalLoading" @click="submit" v-if="modalType != 'info'">提交</Button>
        </div>
    </Modal>
</template>
<script>
import { addData, infoData, updateData, myUseList } from '@/api/pack'
import { getPackagelistApi, addPackageApi, updatePackageApi } from '@/api/globalManage'
import { checkTxt, checkTxtDef, timeFmt, checkFieldTipReqs } from '@/libs/util'
export default {
  name: '',
  components: {

  },
  props: {

  },
  data () {
    return {
      checkTxt,
      checkTxtDef,
      timeFmt,
      modalShow: false,
      modalType: 'add',
      modalLoading: false,
      modalTitle: '创建视频套餐',
      infoTitle: '',
      rowGutter: 10,
      labelWidth: 80,
      dataForm: {},
      dataRules: {

      },
      dataType: 'video',
      videoList: [],
      cVideoList: []
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
      this.getMyVideos()
    },
    getMyVideos () {
      let _that = this
      myUseList().then(res => {
        if (res.data) {
          _that.videoList = res.data
        }
      })
    },
    open (dt, type, code) {
      if (dt == 'recharge') {
        this.modalTitle = '创建充值套餐'
        this.infoTitle = '套餐内容'
      } else {
        this.modalTitle = '创建视频套餐'
        this.infoTitle = '套餐内容'
      }
      this.cVideoList = []
      this.modalLoading = false
      this.modalShow = true
      this.dataType = dt
      this.dataForm = { }
      if (type == null || type == 'add') {
        this.modalType = 'add'
      } else {
        this.modalType = type
        this.getInfo(code)
      }
    },
    getInfo (code) {
      let _that = this
      _that.modalLoading = true
      getPackagelistApi({ code: code }).then(res => {
        _that.modalLoading = false
        _that.dataForm = res.rows[0]
        _that.dataForm.use = _that.dataForm.use + ''
        let zList = _that.dataForm.pws
        if (zList && zList.length > 0) {
          let nList = []
          for (let i = 0; i < zList.length; i++) {
            const iObj = zList[i]
            nList.push(parseInt(iObj.worksId))
          }
          _that.cVideoList = nList
        }
      })
    },
    moduleClose () {
      this.modalShow = false
    },
    submit () {
      let _that = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let d = _that.dataForm
          if (this.cVideoList && this.cVideoList.length > 0) {
            let nList = []
            for (let i = 0; i < this.cVideoList.length; i++) {
              const iObj = this.cVideoList[i]
              nList.push({ worksId: iObj })
            }
            d.pws = nList
          }
          if (_that.modalType == 'add') {
            if (_that.dataType == 'video') {
              let fs = [ { f: 'name', m: '套餐名称' }, { f: 'originMoney', m: '原价' }, { f: 'money', m: '优惠价' } ]
              if (!checkFieldTipReqs(d, fs)) {
                return
              }
              if (d.pws == null || d.pws.length == 0) {
                _that.$Message.warning('至少选择一个视频')
                return
              }
              d.type = 'video'
              _that.modalLoading = true
              addPackageApi(d).then(res => {
                _that.modalLoading = false
                _that.$Message.success('创建套餐成功')
                _that.$emit('lastLoad')
                _that.moduleClose()
              })
            } else {
              let fs = [ { f: 'name', m: '套餐名称' }, { f: 'originMoney', m: '原价' }, { f: 'money', m: '优惠价' }, { f: 'res', m: '可获得平台币' }, { f: 'gifts', m: '赠送平台币' } ]
              if (!checkFieldTipReqs(d, fs)) {
                return
              }
              d.type = 'recharge'
              _that.modalLoading = true
              addPackageApi(d).then(res => {
                _that.modalLoading = false
                _that.$Message.success('创建套餐成功')
                _that.$emit('lastLoad')
                _that.moduleClose()
              })
            }
          } else {
            _that.modalLoading = true
            updatePackageApi(d).then(res => {
              _that.modalLoading = false
              _that.$Message.success('修改成功')
              _that.$emit('lastLoad')
              _that.moduleClose()
            })
          }
        } else {
          this.$Message.error('请填写必要信息')
        }
      })
    }
  }
}
</script>
