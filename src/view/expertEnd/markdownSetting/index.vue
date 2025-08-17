<template>
  <div class="markdown-setting">
    <Card :bordered="true">
      <div class="top-tools" style="display: flex; align-items: center; margin-bottom: 10px;">
        <Select
          v-model="curMarkdown"
          :label-in-value="true"
          placeholder="请选择"
            style="width: 200px; z-index: 1001; margin-right: 10px;"
            @on-change="selectChange"
          >
            <Option
              v-for="item in markdownList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
          >
        </Select>
        <Button type="primary" @click="insertImg">插入图片</Button>
      </div>
      <Editor
        :value="markdownType[curMarkdown].value"
        :ref="`${markdownType[curMarkdown].ref}`"
      />
      <div style="display: flex; justify-content: end; margin-top: 5px">
        <Button type="primary" @click="editorSave(curMarkdown)">保存</Button>
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
import Editor from '@/components/editor/editor.vue'
import chooseSourceMaterial from '_c/chooseSourceMaterial/chooseSourceMaterial.vue'
import { addDevice, getDeviceList, updateDevice } from '@/api/expertEnd'
export default {
  components: {
    Editor,
    chooseSourceMaterial
  },
  data () {
    return {
      markdownList: [
        {
          value: 'h5_user_protocol',
          label: '最新动态'
        },
        {
          value: 'h5_private_strategy',
          label: '隐私策略'
        },
        {
          value: 'withdrawal',
          label: '提现说明(H5)'
        },
        {
          value: 'tools',
          label: '工具箱'
        },
        {
          value: 'promotation_detail',
          label: '推广详情'
        },
        {
          value: 'membershipAgreement',
          label: '会员协议'
        },
        // {
        //   value: 'rulesForReceivingCoins',
        //   label: '领取金币规则'
        // },
        {
          value: 'earningsDescription',
          label: '收益说明'
        },
        {
          value: 'depositProtocol',
          label: '充值协议'
        },
        // {
        //   value: 'aboutUs',
        //   label: '关于我们'
        // },
        {
          value: 'log_off',
          label: '注销需知'
        },
        {
          value: 'license_center',
          label: '证照中心'
        },
        {
          value: 'beian_info',
          label: '备案信息'
        },
        {
          value: 'cancellationOfTheAgreement',
          label: '注销协议'
        },
        {
          value: 'purchasingNotice',
          label: '购买须知'
        },
        {
          value: 'withdrawalInstructionsH5',
          label: '提现说明（h5）'
        },
        {
          value: 'withdrawalInstructionsAPP',
          label: '提现说明（APP）'
        },
        {
          value: 'protect_personal_info_notice',
          label: '更新历史'
        },
        {
          value: 'shared_third_info',
          label: '违规词'
        },
        {
          value: 'permission',
          label: 'H5 App下载'
        },
        {
          value: 'recruit',
          label: '招募设置'
        },
        // {
        //   value: 'video',
        //   label: '视频声明'
        // },
        // {
        //   value: 'advertisement',
        //   label: '广告栏'
        // },
        {
          value: 'privacy_policy',
          label: '隐私政策'
        },
        // {
        //   value: 'use_video',
        //   label: '使用教程'
        // },
        // {
        //   value: 'customer_service',
        //   label: '平台客服'
        // },
        {
          value: 'download_person_info',
          label: '个人信息下载'
        },
        {
          value: 'qiandao_rule',
          label: '签到规则'
        }
      ],
      curMarkdown: 'h5_user_protocol',
      markdownType: {
        h5_user_protocol: {
          value: '',
          ref: 'h5_user_protocol',
          h5_user_protocol: {}
        },
        h5_private_strategy: {
          value: '',
          ref: 'h5_private_strategy',
          h5_private_strategy: {}
        },
        withdrawal: {
          value: '',
          ref: 'withdrawal',
          withdrawal: {}
        },
        tools: {
          value: '',
          ref: 'tools',
          tools: {}
        },
        promotation_detail: {
          value: '',
          ref: 'promotation_detail',
          promotation_detail: {}
        },
        membershipAgreement: {
          value: '',
          ref: 'membershipAgreement',
          membershipAgreement: {}
        },
        // rulesForReceivingCoins: {
        //   value: '',
        //   ref: 'rulesForReceivingCoins',
        //   rulesForReceivingCoins: {}
        // },
        earningsDescription: {
          value: '',
          ref: 'earningsDescription',
          earningsDescription: {}
        },
        depositProtocol: {
          value: '',
          ref: 'depositProtocol',
          depositProtocol: {}
        },
        // aboutUs: {
        //   value: '',
        //   ref: 'aboutUs',
        //   aboutUs: {}
        // },
        log_off: {
          value: '',
          ref: 'log_off',
          log_off: {}
        },
        license_center: {
          value: '',
          ref: 'license_center',
          license_center: {}
        },
        beian_info: {
          value: '',
          ref: 'beian_info',
          beian_info: {}
        },
        cancellationOfTheAgreement: {
          value: '',
          ref: 'cancellationOfTheAgreement',
          cancellationOfTheAgreement: {}
        },
        purchasingNotice: {
          value: '',
          ref: 'purchasingNotice',
          purchasingNotice: {}
        },
        withdrawalInstructionsH5: {
          value: '',
          ref: 'withdrawalInstructionsH5',
          withdrawalInstructionsH5: {}
        },
        withdrawalInstructionsAPP: {
          value: '',
          ref: 'withdrawalInstructionsAPP',
          withdrawalInstructionsAPP: {}
        },
        protect_personal_info_notice: {
          value: '',
          ref: 'protect_personal_info_notice',
          protect_personal_info_notice: {}
        },
        shared_third_info: {
          value: '',
          ref: 'shared_third_info',
          shared_third_info: {}
        },
        permission: {
          value: '',
          ref: 'permission',
          permission: {}
        },
        recruit: {
          value: '',
          ref: 'recruit',
          recruit: {}
        },
        privacy_policy: {
          value: '',
          ref: 'privacy_policy',
          privacy_policy: {}
        },
        // use_video: {
        //   value: '',
        //   ref: 'use_video',
        //   use_video: {}
        // },
        // customer_service: {
        //   value: '',
        //   ref: 'customer_service',
        //   customer_service: {}
        // },
        // download_person_info: {
        // value: '',
        // ref: 'download_person_info',
        //  download_person_info: {}
        // },
        qiandao_rule: {
          value: '',
          ref: 'qiandao_rule',
          qiandao_rule: {}
        }
      },
      isChoose: false,
      customerModal: false,
      customerimgUrl: ''
    }
  },
  watch: {
    curMarkdown: {
      handler () {
        this.getMarkdownContent()
      }
    }
  },
  mounted () {
    this.getMarkdownContent()
  },
  methods: {
    selectChange ({ value, label }) {
      console.log(value, label)
    },
    getMarkdownContent () {
      getDeviceList(this.curMarkdown).then((res) => {
        if (res.data.length > 0) {
          this.markdownType[this.curMarkdown][this.curMarkdown] = res.data[0]
          this.markdownType[this.curMarkdown].value = res.data[0].val
          this.$refs[this.markdownType[this.curMarkdown].ref].setHtml(
            res.data[0].val
          )
        } else {
          this.markdownType[this.curMarkdown][this.curMarkdown] = {}
          this.markdownType[this.curMarkdown].value = ''
          this.$refs[this.markdownType[this.curMarkdown].ref].setHtml('')
        }
      })
    },
    editorSave (type) {
      const html = this.$refs[type].getHtml()
      const data = {
        code: type,
        name: type,
        val: html,
        type: type
      }

      const preContent = this.markdownType[type][type]
      if (preContent.val) {
        updateDevice({
          ...preContent,
          ...data
        }).then(() => {
          this.$Message.success('更新成功')
        })
      } else {
        addDevice(data).then(() => {
          this.$Message.success('保存成功')
        })
      }
    },
    insertImg () {
      this.customerModal = true
    },
    openImg () {
      let url = this.customerimgUrl
      if (!url) {
        this.$Message.warning('未上传')
        return
      }
      this.$refs.mediaSee.open(url)
    },
    handleOk () {
      this.$refs[this.curMarkdown].insertImg(this.customerimgUrl)
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
:deep(.ivu-select-dropdown) {
  z-index: 1001;
}
:deep(.w-e-text-container) {
  z-index: 1000 !important;
}
:deep(.w-e-menu) {
  z-index: 1000 !important;
}
:deep(.w-e-text-container) {
  z-index: 999 !important;
  height: 500px !important;
}
</style>
