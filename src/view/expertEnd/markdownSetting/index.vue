<template>
  <div class="markdown-setting">
    <Card :bordered="true">
      <Select
        v-model="curMarkdown"
        :label-in-value="true"
        placeholder="请选择"
        style="width: 200px; margin-bottom: 10px; z-index: 1001"
        @on-change="selectChange"
      >
        <Option
          v-for="item in markdownList"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
      <Editor
        :value="markdownType[curMarkdown].value"
        :ref="`${markdownType[curMarkdown].ref}`"
      />
      <div style="display: flex; justify-content: end; margin-top: 5px">
        <Button type="primary" @click="editorSave(curMarkdown)">保存</Button>
      </div>
    </Card>
  </div>
</template>
<script>
import Editor from '@/components/editor/editor.vue'
import { addDevice, getDeviceList, updateDevice } from '@/api/expertEnd'
export default {
  components: {
    Editor
  },
  data () {
    return {
      markdownList: [
        {
          value: 'h5_user_protocol',
          label: '用户协议'
        },
        {
          value: 'h5_private_strategy',
          label: '隐私策略'
        },
        {
          value: 'withdrawal',
          label: '提现说明'
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
        {
          value: 'rulesForReceivingCoins',
          label: '领取金币规则'
        },
        {
          value: 'earningsDescription',
          label: '收益说明'
        },
        {
          value: 'depositProtocol',
          label: '充值协议'
        },
        {
          value: 'aboutUs',
          label: '关于我们'
        },
        {
          value: 'cancellationNotice',
          label: '注销需知'
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
        rulesForReceivingCoins: {
          value: '',
          ref: 'rulesForReceivingCoins',
          rulesForReceivingCoins: {}
        },
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
        aboutUs: {
          value: '',
          ref: 'aboutUs',
          aboutUs: {}
        },
        cancellationNotice: {
          value: '',
          ref: 'cancellationNotice',
          cancellationNotice: {}
        }
      }
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
      console.log(html)
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
    }
  }
}
</script>
<style scoped>
:deep(.ivu-select-dropdown) {
  z-index: 1001;
}
:deep(.w-e-text-container) {
  z-index: 1 !important;
}
:deep(.w-e-menu) {
  z-index: 1 !important;
}
</style>
