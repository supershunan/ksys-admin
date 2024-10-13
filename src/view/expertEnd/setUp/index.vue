<template>
    <div>
        <Card>
            <template #title>
                <span class="notice_title ">客服</span>
            </template>
            <div>
                <div>
                    <img style="width: 200px;" @click="openImg" :src="customerimgUrl" />
                </div>
                <Button style="margin-top: 5px;" type="primary" size="small" @click="customerModal = true">上传图片</Button>
            </div>
            <mediaSee ref="mediaSee"></mediaSee>
            <div class="btn-save">
                <Button type="primary" @click="handleSubmit(configurationType.customerimgUrl)">保存</Button>
            </div>
        </Card>
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
                  <Input v-model="customerimgUrl" placeholder="请选择图片地址" style="width: 300px" />
                  <Button @click="goChoose">选择</Button>
                </div>
                <img v-if="customerimgUrl" width="200" height="150" :src="customerimgUrl" />
              </div>
            </div>
        </Modal>
    </div>
</template>

<script>
import chooseSourceMaterial from '_c/chooseSourceMaterial/chooseSourceMaterial.vue'
import { addDevice, getDeviceList, updateDevice } from '@/api/expertEnd'
export default {
  components: {
    chooseSourceMaterial
  },
  data () {
    return {
      isChoose: false,
      customerModal: false,
      customerimgUrl: '',
      configurationType: {
        customerimgUrl: 'customer_service'
      },
      customer_service: {}
    }
  },
  mounted () {
    this.getSetting()
  },
  methods: {
    getSetting () {
      Object.keys(this.configurationType).forEach(key => {
        getDeviceList(this.configurationType[key]).then(res => {
          if (res.data.length > 0) {
            this[this.configurationType[key]] = res.data[0]
            this[key] = res.data[0].val
          }
        })
      })
      console.log(this.tools)
    },
    openImg () {
      let url = this.customerimgUrl
      if (!url) {
        this.$Message.warning('未上传')
        return
      }
      this.$refs.mediaSee.open(url)
    },
    handleSubmit (type) {
      const data = {
        code: type,
        name: type,
        val: this.customerimgUrl,
        type: type
      }
      if (this[type].val) {
        updateDevice({
          ...this[type],
          ...data
        }).then(() => {
          this.getSetting()
          this.$Message.success('保存成功')
        })
      } else {
        addDevice(data).then(() => {
          this.getSetting()
          this.$Message.success('更新成功')
        })
      }
    },
    handleOk () {
      this.customerModal = false
    },
    handleCancel () {
      this.customerModal = false
    },
    chooseSource (item) {
      this.customerimgUrl = item.url
    },
    goBack () {
      this.isChoose = false
    },
    goChoose () {
      this.isChoose = true
    }
  }
}
</script>

<style scoped>
.notice_title {
    font-size: 20px;
    font-weight: bolder;
}
.btn-save {
    display: flex;
    justify-content: end;
    margin-top: 10px;
}
</style>
