<template>
    <Card>
        <div>
            <Editor :value="editorValue" ref="EditorRef" />
            <div style="display: flex; justify-content: end; margin-top: 5px;">
                <Button type="primary" @click="editorSave">保存</Button>
            </div>
        </div>
      </Card>
</template>

<script>
import Editor from '@/components/editor/editor.vue'
export default {
  components: {
    Editor
  },
  data () {
    return {
      editorValue: 'hello world'
    }
  },
  methods: {
    editorSave () {
      this.$refs.EditorRef.getHtml()
    }
  }
}
</script>
