<style lang="less" scoped>
    .upload-item {
        position: relative;
        display: inline-block;
        height: auto;
        width: auto;
        .img-sing-item {
            width: 60px;
            height: 60px;
            border-radius: 2px;
            img {
                width: 100%;
                height: 100%;
                cursor: pointer;
            }
        }
        .img-many-up {
            float: right;
            margin: 5px;
        }
        .img-many-item {
            float: right;
            width: 58px;
            height: 58px;
            border-radius: 2px;
            border: 1px dashed grey;
            img {
                width: 30px;
                height: 30px;
                cursor: pointer;
            }
        }
        .img-many-data {
            float: right;
            width: 60px;
            height: 60px;
            border-radius: 2px;
            margin: 5px;
            img {
                width: 100%;
                height: 100%;
                cursor: pointer;
            }
        }
        .video-sing-item {
            padding: 20px 0;
            width: 300px;
            img {
                width: 30px;
                height: 30px;
            }
            video {
                width: 90px;
                height: 90px;
            }
        }
    }
</style>
<template>
    <div class="upload-item" :style="modalStyle">
        <Spin v-if="isLoading" fix></Spin>
        <template v-if="modalType == 'imgSing'">
            <Upload ref="uploadImgSing" :action="uploadUrl" :headers="headers" :multiple="multiple" :paste="paste" :data="datas" :show-upload-list="false" :format="fileFormat"
            :type="choiceType" :accept="fileAccept" :max-size="fileMaxSize" :before-upload="uploadBefore" :on-success="uploadSuccess" :on-error="uploadError"
            :on-exceeded-size="excMaxSize" :on-format-error="noFmt">
                <div ref="imgSingDom" class="img-sing-item el-center-list">
                    <img :src="imgSingSrc" />
                </div>
            </Upload>
        </template>
        <template v-else-if="modalType == 'imgMany'">
            <Poptip v-for="v,i in imgManyList">
                <div slot="content">
                    <Button size="small" type="primary" class="mg-btn">查看</Button>
                    <Button size="small" type="error" class="mg-btn">删除</Button>
                </div>
                <div class="img-many-data el-center-list">
                    <img :src="v.url" />
                </div>
            </Poptip>
            <Upload class="img-many-up" ref="uploadImgMany" :action="uploadUrl" :headers="headers" :multiple="multiple" :paste="paste" :data="datas" :show-upload-list="false" :format="fileFormat"
            :type="choiceType" :accept="fileAccept" :max-size="fileMaxSize" :before-upload="uploadBefore" :on-success="uploadSuccess" :on-error="uploadError"
            :on-exceeded-size="excMaxSize" :on-format-error="noFmt">
                <div ref="imgManyDom" class="img-many-item el-center-list">
                    <img :src="imgManySrc" />
                </div>
            </Upload>
        </template>
        <template v-else-if="modalType == 'videoSing'">
            <Upload ref="uploadVideoSing" :action="uploadUrl" :headers="headers" :multiple="multiple" :paste="paste" :data="datas" :show-upload-list="false" :format="fileFormat"
            :type="choiceType" :accept="fileAccept" :max-size="fileMaxSize" :before-upload="uploadBefore" :on-success="uploadSuccess" :on-error="uploadError"
            :on-exceeded-size="excMaxSize" :on-format-error="noFmt">
                <div ref="videoSingDom" class="video-sing-item">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff" v-if="videoSingSrc == null"></Icon>
                    <video v-else ref="videoSingDom":src="videoSingSrc" @loadedmetadata="getVideoDuration"></video>
                    <p v-if="videoSingSrc == null">请上传{{changeFileSize(fileMaxSize)}}大小的视频</p>
                    <p v-else style="color: green;">已上传</p>
                </div>
            </Upload>
        </template>
    </div>
</template>
<script>
import fileIcon from '@/assets/images/icon/file.png'
import videoIcon from '@/assets/images/icon/video.png'
import addFileIcon from '@/assets/images/icon/addFile.png'
import audioIcon from '@/assets/images/icon/addFile.png'
import imgIcon from '@/assets/images/icon/img.png'
import axios from 'axios'
import { fileSuffixs } from '@/libs/dict.js'
export default {
  name: '',
  components: {

  },
  props: {
    type: {
      type: String,
      default: 'imgSing'
    },
    item: {
      type: String,
      default: 'common'
    },
    module: {
      type: String,
      default: 'file'
    },
    size: {
      type: Number,
      default: 300
    },
    ms: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      fileIcon,
      addFileIcon,
      imgIcon,
      videoIcon,
      audioIcon,
      isLoading: false,
      modalStyle: {},
      modalType: '',
      uploadUrl: '/apiFile/file/upload',
      uploadShardUrl: '/apiFile/file/splitFileUpload',
      multiple: false,
      paste: true,
      choiceType: 'select',
      fileAccept: '.*',
      fileFormat: [],
      fileMaxSize: 0,
      headers: {},
      datas: {},
      fileName: '',
      bigFile: null,
      bigMax: this.$config.shardMax,
      bigChunk: 0,
      bigChunks: 0,
      bigChunkSize: this.$config.shardSize,
      imgSingSrc: imgIcon,
      imgManyList: [],
      imgManySrc: addFileIcon,
      videoSingSrc: null,
      videoTime: 0
    }
  },
  computed: {

  },
  created () {},
  watch: {
    bigFile: function (v) {
      this.uploadBigFile()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.headers[this.$store.state.user.tokenHeader] = this.$store.state.user.token
      this.datas = { item: this.item, module: this.module }
      this.modalType = this.type
      this.fileMaxSize = this.size
      if (this.ms != null) {
        this.modalStyle = { ...this.ms }
      }
      this.loadType()
    },
    loadType () {
      let type = this.modalType
      if (type == 'imgSing') {
        this.multiple = false
        let t = 'image'
        this.fileFormat = fileSuffixs[t]
        this.fileAccept = this.rendSuffix(t)
        this.choiceType = 'select'
      } else if (type == 'imgMany') {
        this.multiple = true
        let t = 'image'
        this.fileFormat = fileSuffixs[t]
        this.fileAccept = this.rendSuffix(t)
        this.choiceType = 'select'
      } else if (type == 'videoSing') {
        this.multiple = false
        let t = 'video'
        this.fileFormat = fileSuffixs[t]
        this.fileAccept = this.rendSuffix(t)
        this.choiceType = 'drag'
      }
    },
    resetData () {
      let type = this.modalType
      if (type == 'imgSing') {
        this.imgSingSrc = imgIcon
      } else if (type == 'imgMany') {
        this.imgManyList = []
        this.imgManySrc = addFileIcon
      } else if (type == 'videoSing') {
        this.videoSingSrc = null
        this.videoTime = 0
      }
    },
    setVal (ds) {
      let type = this.modalType
      if (type == 'imgSing') {
        this.imgSingSrc = ds
      } else if (type == 'imgMany') {
        this.imgManyList = ds
      } else if (type == 'videoSing') {
        this.videoSingSrc = ds
      }
    },
    clickFile () {
      let type = this.modalType
      if (type == 'imgSing') {
        this.$refs.imgSingDom.click()
      } else if (type == 'imgMany') {
        this.$refs.imgManyDom.click()
      } else if (type == 'videoSing') {
        this.$refs.videoSingDom.click()
      }
    },
    rendSuffix (k) {
      let sList = [...fileSuffixs[k]]
      for (let i = 0; i < sList.length; i++) {
        sList[i] = `.${sList[i]}`
      }
      return sList.join(',')
    },
    uploadBefore (file) {
      let size = file.size
      if (size < this.bigMax) {
        this.isLoading = true
        return true
      } else {
        this.isLoading = true
        let randomNum = Math.floor(Math.random() * 900000) + 100000
        this.fileName = `${randomNum}_${file.name}`
        this.bigFile = file
        let chunkSize = this.bigChunkSize
        this.bigChunks = Math.ceil(file.size / 1024 / 1024 / chunkSize)
        return false
      }
    },
    uploadSuccess (res) {
      let type = this.modalType
      if (type == 'imgMany') {
        this.imgManyList.push({ url: res.data })
      } else if (type == 'videoSing') {
        this.videoSingSrc = res.data
      } else if (type == 'imgSing') {
        this.imgSingSrc = res.data
      }
      this.isLoading = false
      this.$emit('fileResult', res.data)
    },
    uploadError (e) {
      console.log(e)
      this.$Message.error(`上传错误`)
      this.isLoading = false
      this.$emit('fileError', null)
    },
    excMaxSize () {
      this.$Message.warning(`超出文件限制大小，请上传${this.changeFileSize(this.fileMaxSize)}大小的文件`)
      this.isLoading = false
    },
    changeFileSize (size) {
      if (size == null) {
        return '0B'
      }
      if (size < 1024) {
        return `${size}KB`
      } else if (size < 1024 * 1024) {
        return `${size / 1024}MB`
      } else if (size < 1024 * 1024 * 1024) {
        return `${size / (1024 * 1024)}GB`
      }
      return '0B'
    },
    noFmt () {
      let nList = [...this.fileFormat]
      this.$Message.warning(`不符合可上传文件类型，请上传${nList.join('，')}等类型的文件`)
      this.isLoading = false
    },
    getVideoDuration () {
      const video = this.$refs.videoSingDom
      this.videoTime = Math.floor(video.duration)
      this.$emit('videoTimeResult', this.videoTime)
    },
    uploadBigFile () {
      let file = this.bigFile
      let fileForm = new FormData()
      fileForm.append('file', file.slice(this.bigChunk * 1024 * 1024 * 2, (this.bigChunk + 1) * 1024 * 1024 * 2))
      fileForm.append('chunk', this.bigChunk)
      fileForm.append('chunks', this.bigChunks)
      fileForm.append('name', this.fileName)
      fileForm.append('item', this.item)
      fileForm.append('module', this.module)
      let _that = this
      let config = {
        headers: {
          [this.$store.state.user.tokenHeader]: this.$store.state.user.token
        }
      }
      axios.post(this.uploadShardUrl, fileForm, config).then(res => {
        _that.bigChunk = _that.bigChunk + 1
        if (_that.bigChunk < _that.bigChunks) {
          _that.$emit('filePro', (_that.bigChunk / (_that.bigChunks - 1) * 100).toFixed(2))
          _that.uploadBigFile()
        } else {
          let type = _that.modalType
          if (type == 'imgMany') {
            _that.imgManyList.push({ url: res.data.data })
          } else if (type == 'videoSing') {
            _that.videoSingSrc = res.data.data
          } else if (type == 'imgSing') {
            _that.imgSingSrc = res.data.data
          }
          _that.isLoading = false
          _that.$emit('fileResult', res.data.data)
        }
      })
    }
  }
}
</script>
