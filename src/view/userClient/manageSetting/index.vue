<template>
  <div>
    <Card style="width: 100%">
      <template #title> 视频配置 </template>
      <div>
        <Form
          ref="videoForm"
          :model="videoForm"
          :rules="ruleValidate"
          :label-width="80"
        >
          <FormItem label="视频声明" prop="videoDeclaration">
            <Input
              type="text"
              v-model="videoForm.videoDeclaration"
              number
            ></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('videoForm')"
              >保存</Button
            >
          </FormItem>
        </Form>
      </div>
    </Card>
    <div class="video-bottom">
      <Card style="width: 45%">
        <template #title> 分类设置 </template>
        <div>
            <Form ref="formDynamic" :model="formDynamic" :label-width="80" style="width: 300px">
        <template v-for="(item, index) in formDynamic.items">
          <FormItem
                  v-if="item.status"
                  :key="index"
                  :label="'分类 ' + item.index"
                  :prop="'items.' + index + '.value'"
                  :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
              <Row>
                  <Col span="18">
                      <Input type="text" v-model="item.value" placeholder="输入分类名"></Input>
                  </Col>
                  <Col span="4" offset="1">
                      <Button @click="handleRemove(index)">删除</Button>
                  </Col>
              </Row>
          </FormItem>
        </template>
        <FormItem>
            <Row>
                <Col span="12">
                    <Button type="dashed" long @click="handleAdd" icon="md-add">添加分类</Button>
                </Col>
            </Row>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleClassifySubmit('formDynamic')">保存</Button>
            <Button @click="handleReset('formDynamic')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
        </div>
      </Card>
      <Card style="width: 53%">
        <template #title> 招募设置 </template>
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
import Editor from '@/components/editor/editor.vue'
export default {
  components: {
    Editor
  },
  data () {
    return {
      videoForm: {
        videoDeclaration: ''
      },
      ruleValidate: {
        videoDeclaration: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ]
      },
      index: 1,
      formDynamic: {
        items: [
          {
            value: '',
            index: 1,
            status: 1
          }
        ]
      },
      editorValue: 'hello world'
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    handleClassifySubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          console.log(this.formDynamic)
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    handleAdd () {
      this.index++
      this.formDynamic.items.push({
        value: '',
        index: this.index,
        status: 1
      })
    },
    handleRemove (index) {
      this.formDynamic.items[index].status = 0
    },
    editorSave () {
      this.$refs.EditorRef.getHtml()
    }
  }
}
</script>

<style lang="less" scoped>
.video-bottom {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
