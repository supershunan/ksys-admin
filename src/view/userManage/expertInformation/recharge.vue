<style lang="less" scoped>

</style>
<template>
    <Modal v-model="modalShow" :title="modalTitle">
        <Form ref="dataForm" :model="dataForm" :label-width="labelWidth" :rules="dataRules">
            <FormItem prop="money" label="充值金额">
                <Input type="number" v-model="dataForm.money" placeholder="请输入"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button size="large" @click="moduleClose">取消</Button>
            <Button type="primary" size="large" :loading="modalLoading" @click="submit">提交</Button>
        </div>
    </Modal>
</template>
<script>
import { rechargeData } from '@/api/user'
export default {
  name: '',
  components: {

  },
  props: {

  },
  data () {
    return {
      modalShow: false,
      modalLoading: false,
      modalTitle: '充值',
      labelWidth: 80,
      dataForm: {},
      dataRules: {
        money: [
          { required: true, message: '请填写充值金额', trigger: 'blur' }
        ]
      }
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

    },
    open (id) {
      this.modalShow = true
      this.dataForm = { id: id, money: 0 }
    },
    moduleClose () {
      this.modalShow = false
    },
    submit () {
      let _that = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let d = _that.dataForm
          if (d.money < 10) {
            _that.$Message.warning('充值金额不可少于10元')
            return
          }
          _that.modalLoading = true
          rechargeData(d).then(res => {
            _that.modalLoading = false
            _that.$Message.success('充值成功')
            _that.$emit('lastLoad')
            _that.modalShow = false
          })
        } else {
          this.$Message.error('请填写必要信息')
        }
      })
    }
  }
}
</script>
