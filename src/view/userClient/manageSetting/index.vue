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
            <Input type="text" v-model="videoForm.val"></Input>
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
      <Card style="width: 100%">
        <template #title> 分类设置 </template>
        <div v-for="item in formDynamic" :key="item.id">
          <div style="margin-bottom: 10px">
            <Row>
              <Col span="12">
                <Input
                  type="text"
                  v-model="item.name"
                  placeholder="输入分类名"
                ></Input>
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
        <Row
          type="flex"
          justify="center"
          align="middle"
          style="margin-top: 10px"
        >
          <Col span="12">
            <Button type="dashed" long @click="classifyStaticAdd" icon="md-add"
              >添加分类</Button
            >
          </Col>
        </Row>
      </Card>
    </div>
    <div class="app-setting">
      <Card style="width: 100%">
        <template #title> APP设置 </template>
        <div style="width: 500px">
          <Form
            ref="aboutForm"
            :model="aboutForm"
            :rules="ruleValidate"
            :label-width="80"
          >
            <FormItem label="版本号" prop="version">
              <Input type="text" v-model="aboutForm.version"></Input>
            </FormItem>
            <FormItem label="Logo" prop="logo">
              <div>
                <img
                  style="width: 200px"
                  @click="openImg"
                  :src="aboutForm.logo"
                />
              </div>
              <Button
                style="margin-top: 5px"
                type="primary"
                size="small"
                @click="customerModal = true"
                >上传图片</Button
              >
            </FormItem>
            <FormItem label="客服热线" prop="customerServiceHotline">
              <Input
                type="text"
                v-model="aboutForm.customerServiceHotline"
              ></Input>
            </FormItem>
            <FormItem label="更新内容" prop="descr">
              <Input type="textarea" v-model="aboutForm.descr"></Input>
            </FormItem>
            <FormItem label="下载地址" prop="editionUrl">
              <Input type="text" v-model="aboutForm.editionUrl"></Input>
              <Upload
                :action="uploadUrl"
                :multiple="false"
                :headers="headers"
                :on-success="uploadSuccess"
                :show-upload-list="false"
              >
                <Button icon="ios-cloud-upload-outline">上传文件</Button>
              </Upload>
            </FormItem>
            <FormItem label="强制更新" prop="editionForce">
              <Select v-model="aboutForm.editionForce">
                <Option :value="0">否</Option>
                <Option :value="1">是</Option>
              </Select>
            </FormItem>
            <FormItem label="更新方式" prop="packageType">
              <Select v-model="aboutForm.packageType">
                <Option :value="0">整包升级</Option>
                <Option :value="1">WGT升级</Option>
              </Select>
            </FormItem>
            <FormItem label="是否发行" prop="editionIssue">
              <Select v-model="aboutForm.editionIssue">
                <Option :value="0">否</Option>
                <Option :value="1">是</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handlAboutUsSubmit">保存</Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
    <Modal
      style="z-index: 99999999"
      v-model="customerModal"
      title="添加图片"
      @on-ok="handleOk"
      @on-cancel="handleCancel"
    >
      <div>
        <div v-show="isChoose">
          <chooseSourceMaterial @chooseSource="chooseSource" @goBack="goBack" />
        </div>
        <div v-show="!isChoose">
          <div>
            <Input
              v-model="aboutForm.logo"
              placeholder="请选择图片地址"
              style="width: 300px"
            />
            <Button @click="goChoose">选择</Button>
          </div>
          <img
            v-if="aboutForm.logo"
            width="200"
            height="150"
            :src="aboutForm.logo"
          />
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  updateApi,
  getVideoStatement,
  getClassify,
  updateClassify,
  addClassify,
  deleteClassify,
  getAppAboutUsApi,
  addAppAboutUsApi,
  updateAppAboutUsApi
} from '@/api/manageSetting'
import chooseSourceMaterial from '_c/chooseSourceMaterial/chooseSourceMaterial.vue'
export default {
  components: {
    chooseSourceMaterial
  },
  data () {
    return {
      videoForm: {},
      ruleValidate: {
        val: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
      },
      formDynamic: [],
      aboutForm: {},
      customerModal: false,
      isChoose: false,
      headers: {
        [this.$store.state.user.tokenHeader]: this.$store.state.user.token
      },
      uploadUrl: '/apiFile/file/upload'
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
      this.getAppAboutUs()
    },
    getAppAboutUs () {
      getAppAboutUsApi().then((res) => {
        if (res.rows.length > 0) {
          this.aboutForm = res.rows[0]
        }
      })
    },
    handlAboutUsSubmit () {
      this.$refs['aboutForm'].validate(async (valid) => {
        if (valid) {
          if (this.aboutForm.id) {
            await updateAppAboutUsApi(this.aboutForm)
            this.$Message.success('修改成功')
          } else {
            await addAppAboutUsApi(this.aboutForm)
            this.$Message.success('添加成功')
          }
          this.getAppAboutUs()
        } else {
          this.$Message.error('Fail!')
        }
      })
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
      getVideoStatement().then((res) => {
        let d = res.data
        this.videoForm = d
      })
    },
    saveVideoStatement () {
      let d = { ...this.videoForm }
      updateApi(d).then((res) => {
        this.$Message.success('修改成功')
        this.getData()
      })
    },
    getClassify () {
      getClassify().then((res) => {
        this.formDynamic = res.data
      })
    },
    classifyStaticAdd () {
      const filterAry = this.formDynamic.filter((res) => res.id < 1)
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
        code: item.label
        // sort: item.sort
      }
      addClassify(data).then((res) => {
        this.$Message.success('添加成功')
        this.getClassify()
      })
    },
    updateClassify (item) {
      updateClassify(item).then((res) => {
        this.$Message.success('修改成功')
        this.getClassify()
      })
    },
    deleteClassify (item) {
      this.$Modal.confirm({
        title: '是否删除？',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          if (item.id < 1) {
            this.getClassify()
            return
          }
          deleteClassify({ ids: item.id })
          this.getClassify()
        },
        onCancel: () => {
          this.$Message.info('取消')
        }
      })
    },
    openImg () {
      let url = this.aboutForm.logo
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
      this.aboutForm.logo = item.url
    },
    goBack () {
      this.isChoose = false
    },
    goChoose () {
      this.isChoose = true
    },
    uploadSuccess (res) {
      console.log(res)
      if (res.code === 10001) {
        this.aboutForm.editionUrl = res.data
        this.$Message.success('上传成功')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.video-bottom {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}
</style>
