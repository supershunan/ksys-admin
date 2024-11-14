<style lang="less" scoped>

</style>
<template>
    <Modal class="pack-edit" v-model="modalShow" :title="modalTitle" width="600" :styles="{ top:'20px' }">
        <Form ref="dataForm" :model="dataForm" :label-width="labelWidth" :rules="dataRules">
            <Divider orientation="left">{{ modalTitle }}</Divider>
            <FormItem prop="goodsName" label="商品名称">
                <Input type="text" v-model="dataForm.goodsName" placeholder="请输入"></Input>
            </FormItem>
            <FormItem prop="img" label="商品图片">
                <div style="display: flex; align-items: center;">
                    <img style="width: 200px;" @click="openImg" :src="dataForm.img" />
                    <Button style="margin-left: 5px;" type="primary" size="small" @click="customerModal = true">上传图片</Button>
                </div>
                <mediaSee ref="mediaSee"></mediaSee>
            </FormItem>
            <FormItem prop="price" label="价格">
                <Input type="text" v-model="dataForm.price" placeholder="请输入"></Input>
            </FormItem>
            <FormItem prop="store" label="库存">
                <Input v-model="dataForm.store" placeholder="请输入"></Input>
            </FormItem>
            <FormItem prop="changeType" label="交易类型">
                <Select v-model="dataForm.changeType" placeholder="选择交易类型">
                    <Option value="1">现金</Option>
                    <Option value="2">次元币</Option>
                    <Option value="-1">其他</Option>
                </Select>
            </FormItem>
            <FormItem prop="money" label="金额">
                <Input type="number" v-model="dataForm.money" placeholder="请输入"></Input>
            </FormItem>
            <FormItem prop="status" label="是否上架">
              <RadioGroup v-model="dataForm.status">
                <Radio label="1">是</Radio>
                <Radio label="2">否</Radio>
            </RadioGroup>
            </FormItem>
            <FormItem prop="goodsDetail" label="商品描述">
                <Editor
                  :value="dataForm.goodsDetail"
                  ref="editorRef"
                />
            </FormItem>
        </Form>
        <div slot="footer">
            <Button size="large" @click="moduleClose">取消</Button>
            <Button type="primary" size="large" :loading="modalLoading" @click="submit">提交</Button>
        </div>

        <Modal
        style="z-index: 99999999;"
            v-model="customerModal"
            title="添加图片"
            @on-ok="handleOk"
            @on-cancel="handleCancel">
            <div>
              <div v-show="isChoose">
                <chooseSourceMaterial @chooseSource="chooseSource" @goBack="goBack" />
              </div>
              <div  v-show="!isChoose">
                <div>
                  <Input v-model="dataForm.img" placeholder="请选择图片地址" style="width: 300px" />
                  <Button @click="goChoose">选择</Button>
                </div>
                <img v-if="dataForm.img" width="200" height="150" :src="dataForm.img" />
              </div>
            </div>
        </Modal>
    </Modal>
</template>
<script>
import { addStoreApi, updateStoreApi } from '@/api/goldStore'
import chooseSourceMaterial from '_c/chooseSourceMaterial/chooseSourceMaterial.vue'
import Editor from '@/components/editor/editor.vue'
export default {
  components: {
    chooseSourceMaterial,
    Editor
  },
  props: {

  },
  data () {
    return {
      modalShow: false,
      modalType: 'add',
      modalLoading: false,
      modalTitle: '新增商品',
      rowGutter: 10,
      labelWidth: 80,
      dataForm: {
        goodsDetail: 'wkkkk'
      },
      dataRules: {
        goodsName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        img: [{ required: true, message: '请输入商品图片', trigger: 'blur' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        store: [{ required: true, message: '请输入库存', trigger: 'blur' }],
        changeType: [{ required: true, message: '请输入交易类型', trigger: 'blur' }],
        money: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        status: [{ required: true, message: '请输入是否上架', trigger: 'blur' }],
        goodsDetail: [{ required: true, message: '请输入商品描述', trigger: 'blur' }]
      },
      isChoose: false,
      customerModal: false
    }
  },
  methods: {
    open (type, record) {
      this.dataForm = { }
      if (type === 'add') {
        this.modalTitle = '新增商品'
      } else {
        this.modalTitle = '编辑商品'
        this.dataForm = {
          ...record,
          status: record.status + '',
          changeType: record.changeType + '',
          money: record.money + '',
          price: record.price + '',
          store: record.store + '',
          goodsDetail: record.goodsDetail
        }
        this.$refs.editorRef.setHtml(record.goodsDetail)
      }
      this.modalLoading = false
      this.modalType = type
      this.modalShow = true
    },
    moduleClose () {
      this.modalShow = false
      this.dataForm = {}
    },
    submit () {
      this.editorSave()
      this.$refs['dataForm'].validate((valid) => {
        console.log('valid', valid, this.dataForm)
        if (valid) {
          if (this.modalType === 'add') {
            addStoreApi(this.dataForm).then(res => {
              this.$Message.success('添加成功')
              this.$emit('relaod')
              this.moduleClose()
            })
          } else {
            const params = {
              id: Number(this.dataForm.id),
              goodsName: this.dataForm.goodsName,
              goodsDetail: this.dataForm.goodsDetail,
              img: this.dataForm.img,
              price: Number(this.dataForm.price),
              store: Number(this.dataForm.store),
              changeType: Number(this.dataForm.changeType), // 1 现金 2 次元币 -1其他
              money: Number(this.dataForm.money), // 现金金额
              status: Number(this.dataForm.status) // 1-上架 0未上架
            }
            updateStoreApi(params).then(res => {
              this.$Message.success('更新成功')
              this.$emit('relaod')
              this.moduleClose()
            })
          }
        } else {
          this.$Message.error('请填写必要信息')
        }
      }).catch((err) => {
        console.log('error', err)
      })
    },
    openImg () {
      let url = this.dataForm.img
      if (!url) {
        this.$Message.warning('未上传')
        return
      }
      this.$refs.mediaSee.open(url)
    },
    handleOk () {
      this.customerModal = false
    },
    handleCancel () {
      this.customerModal = false
    },
    chooseSource (item) {
      this.dataForm.img = item.url
    },
    goBack () {
      this.isChoose = false
    },
    goChoose () {
      this.isChoose = true
    },
    editorSave () {
      const html = this.$refs.editorRef.getHtml()
      this.dataForm.goodsDetail = html
    }
  }
}
</script>

<style scoped>
:deep(.w-e-toolbar) {
  overflow: scroll;
}
</style>
