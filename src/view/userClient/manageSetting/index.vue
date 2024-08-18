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
          <FormItem label="视频声明" prop="val">
            <Input
              type="text"
              v-model="videoForm.val"
            ></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handlVideoSubmit('videoForm')"
              >保存</Button
            >
          </FormItem>
        </Form>
      </div>
    </Card>
    <div class="video-bottom">
      <Card style="width: 45%">
        <template #title> 分类设置 </template>
        <div v-for="item in formDynamic" :key="item.id">
            <div style="margin-bottom: 10px;">
              <Row>
                  <Col span="12">
                      <Input type="text" v-model="item.name" placeholder="输入分类名"></Input>
                  </Col>
                  <Col span="3" offset="1" v-show="!item.code">
                      <Button @click="saveClassify(item)">保存</Button>
                  </Col>
                  <Col span="3" offset="1" v-show="item.id >= 1">
                      <Button @click="updateClassify(item)">更新</Button>
                  </Col>
                  <Col span="3" offset="1">
                      <Button @click="deleteClassify(item)">删除</Button>
                  </Col>
              </Row>
            </div>
        </div>
        <Row type="flex" justify="center" align="middle" style="margin-top: 10px;">
            <Col span="12">
                <Button type="dashed" long @click="classifyStaticAdd" icon="md-add">添加分类</Button>
            </Col>
        </Row>
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
import { updateApi, getVideoStatement, getClassify, updateClassify, addClassify, deleteClassify } from '@/api/manageSetting'
export default {
  components: {
    Editor
  },
  data () {
    return {
      videoForm: {},
      ruleValidate: {
        val: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ]
      },
      formDynamic: [],
      editorValue: '暂不对接',
      settingType: {
        /** 视频声明 */
        video_statement: 'video_statement',
        /** 招募设置 */
        recruit: 'recruit'
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getData()
    },
    getData () {
      this.getVideoSetting()
      this.getClassify()
    },
    handlVideoSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.saveVideoStatement()
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    getVideoSetting () {
      getVideoStatement().then(res => {
        let d = res.data
        this.videoForm = d
      })
    },
    saveVideoStatement () {
      let d = { ...this.videoForm }
      updateApi(d).then(res => {
        this.$Message.success('修改成功')
        this.getData()
      })
    },
    getClassify () {
      getClassify().then(res => {
        this.formDynamic = res.data
      })
    },
    classifyStaticAdd () {
      const filterAry = this.formDynamic.filter(res => res.id < 1)
      if (filterAry.length > 0) {
        this.$Message.warning('请完成上一次添加')
        return
      }
      this.formDynamic.push({
        id: Math.random(),
        name: '',
        label: `LABEL${this.formDynamic.length + 1}`,
        sort: this.formDynamic.length + 1
      })
    },
    saveClassify (item) {
      const data = {
        name: item.name,
        type: 'video',
        label: item.label,
        sort: item.sort
      }
      addClassify(data).then(res => {
        this.$Message.success('添加成功')
        console.log(res)
      })
    },
    updateClassify (item) {
      updateClassify(item).then(res => {
        this.$Message.success('修改成功')
        this.getClassify()
      })
    },
    deleteClassify (item) {
      if (item.id < 1) {
        this.getClassify()
        return
      }
      deleteClassify({ ids: item.id })
      this.getClassify()
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
