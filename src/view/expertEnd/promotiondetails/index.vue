<template>
    <Card>
        <div>
            <Editor :value="editorValue" ref="EditorRef" />
            {{ editorValue.val }}
            <div style="display: flex; justify-content: end; margin-top: 5px;">
                <Button type="primary" @click="editorSave">保存</Button>
            </div>
        </div>
      </Card>
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
      editorValue: '',
      currentEditorContent: {}
    }
  },
  mounted () {
    this.getEditHtml()
  },
  methods: {
    getEditHtml () {
      getDeviceList('promotation_detail').then(res => {
        if (res.data.length > 0) {
          this.currentEditorContent = res.data[0]
          this.$refs.EditorRef.setHtml(res.data[0].val)
        }
      })
    },
    editorSave () {
      const html = this.$refs.EditorRef.getHtml()
      const data = {
        code: 'promotation_detail',
        name: '推广详情',
        val: html,
        type: 'promotation_detail'
      }
      if (this.currentEditorContent.val) {
        updateDevice({
          ...this.currentEditorContent,
          ...data
        }).then(() => {
          this.getEditHtml()
          this.$Message.success('更新成功')
        })
      } else {
        addDevice(data).then(() => {
          this.getEditHtml()
          this.$Message.success('更新成功')
        })
      }
    }
  }
}
</script>
