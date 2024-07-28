<template>
    <div>
        <Card>
            <template #title>
                <span class="notice_title ">客服</span>
            </template>
            <div>
                <div>
                    <img style="width: 200px;" @click="openImg" :src="imgUrl" />
                </div>
                <Button style="margin-top: 5px;" type="primary" size="small" @click="imgClick"><Icon type="md-cloud-upload" /> 上传图片</Button>
            </div>
            <uploadFile style="display: none;" ref="uploadImg" :size="5 * 1024" item="ksys" module="works" type="imgSing" @fileResult="imgResult" ></uploadFile>
            <mediaSee ref="mediaSee"></mediaSee>
            <div class="btn-save">
                <Button type="primary" @click="handleSubmit()">保存</Button>
            </div>
        </Card>
        <div class="content">
            <Card style="width: 49%">
                <template #title>
                    <span class="notice_title ">工具箱</span>
                </template>
                <div>
                    <Editor :value="editorValue" ref="EditorRef" />
                    <div style="display: flex; justify-content: end; margin-top: 5px;">
                        <Button type="primary" @click="editorSave">保存</Button>
                    </div>
                </div>
            </Card>
            <Card style="width: 49%">
                <template #title>
                    <span class="notice_title ">用户协议</span>
                </template>
                <div>
                    <Editor :value="editorValue" ref="EditorRef" />
                    <div style="display: flex; justify-content: end; margin-top: 5px;">
                        <Button type="primary" @click="editorSave">保存</Button>
                    </div>
                </div>
            </Card>
        </div>
        <div class="content">
            <Card style="width: 49%">
                <template #title>
                    <span class="notice_title ">隐私政策</span>
                </template>
                <div>
                    <Editor :value="editorValue" ref="EditorRef" />
                    <div style="display: flex; justify-content: end; margin-top: 5px;">
                        <Button type="primary" @click="editorSave">保存</Button>
                    </div>
                </div>
            </Card>
            <Card style="width: 49%">
                <template #title>
                    <span class="notice_title ">提现规则</span>
                </template>
                <div>
                    <Editor :value="editorValue" ref="EditorRef" />
                    <div style="display: flex; justify-content: end; margin-top: 5px;">
                        <Button type="primary" @click="editorSave">保存</Button>
                    </div>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import uploadFile from '_c/upload/uploadFile.vue'
import Editor from '@/components/editor/editor.vue'
export default {
  components: {
    uploadFile,
    Editor
  },
  data () {
    return {
      imgUrl: 'https://file.qfyingshi.cn/app/ksys/works/d9c20a19-816e-4d1a-bc27-7259b89dbc2c.png',
      editorValue: 'hello world'
    }
  },
  methods: {
    openImg () {
      let url = this.imgUrl
      if (!url) {
        this.$Message.warning('未上传')
        return
      }
      this.$refs.mediaSee.open(url)
    },
    imgClick () {
      this.$refs.uploadImg.clickFile()
    },
    imgResult (v) {
      this.imgUrl = v
    },
    editorSave () {
      this.$refs.EditorRef.getHtml()
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
.content {
    display: flex;
    justify-content: space-between;
}
</style>
