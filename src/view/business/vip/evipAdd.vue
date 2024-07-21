<style lang="less" scoped>

</style>
<template>
    <Modal v-model="modalShow" :title="modalTitle">
        <Form ref="dataForm" :model="dataForm" :label-width="labelWidth" :rules="dataRules">
            <FormItem prop="expertId" label="达人">
                <Select v-model="dataForm.expertId" :style="selectStyle" placeholder="选择延长的达人会员">
                    <Option v-for="item,i in expertList" :value="item.expertId">{{ item.expertName }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="vipId" label="会员天数">
                <Select v-model="dataForm.vipId" :style="selectStyle" placeholder="选择会员天数">
                    <Option v-for="item,i in vipList" :value="item.id">{{ item.useDay }}天</Option>
                </Select>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button size="large" @click="moduleClose">取消</Button>
            <Button type="primary" size="large" :loading="modalLoading" @click="submit">提交</Button>
        </div>
    </Modal>
</template>
<script>
import { expertListApi,addEvipTimeApi } from "@/api/vip"
import { checkTxt,checkTxtDef,timeFmt,checkFieldReqs } from "@/libs/util"
export default {
  name: '',
  components: {

  },
  props: {
    
  },
  data() {
    return {
        modalShow: false,
        modalLoading: false,
        modalTitle: "会员延时",
        labelWidth: 80,
        selectStyle: { width:'100%' },
        dataForm: {},
        dataRules: {
            expertId: [
                { required: true, message: '请选择达人', trigger: 'blur' }
            ],
        },
        expertList: [],
        vipList: [],
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
      this.getData()
    },
    getData() {
        let _that = this
        expertListApi().then(res => {
            _that.vipList = res.data
        })
    },
    open(id,expertList) {
        this.modalShow = true
        this.expertList = expertList
        this.dataForm = { userId:id }
    },
    moduleClose() {
        this.modalShow = false
    },
    submit() {
        let _that = this
        this.$refs['dataForm'].validate((valid) => {
            if (valid) {
                let d = _that.dataForm
                if (!checkTxt(d.vipId)) {
                    this.$Message.error('请选择会员类型');
                    return
                }
                _that.modalLoading = true
                addEvipTimeApi(d).then(res => {
                    _that.modalLoading = false
                    _that.$Message.success("延长成功")
                    _that.$emit('lastLoad')
                    _that.modalShow = false
                })
            } else {
                this.$Message.error('请填写必要信息');
            }
        })
    },
  },
};
</script>