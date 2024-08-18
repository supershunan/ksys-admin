<style lang="less">
    .mini-info {
        width: 100%;
        height: auto;
        .config-height {
            min-height: 1000px;
        }
        .banner-list {
            padding: 10px 0;
            .banner-item {
                width: 100%;
                height: 200px;
                img {
                    width: 160px;
                    height: 90px;
                }
            }
        }
        .home-list {
            padding: 10px 0;
            .home-item {
                width: 100%;
                height: 200px;
                img {
                    width: 120px;
                    height: 160px;
                }
            }
        }
        .video-list {
            padding: 10px 0;
            .video-item {
                width: 100%;
                height: 200px;
            }
        }
        .input-item {
            float: left;
            width: calc(~"100% - 20px");
            min-height: 38px;
            margin: 5px 10px;
            .input-label {
                float: left;
                width: 100px;
                height: 100%;
            }
            .input-content {
                float: left;
                width: calc(~"100% - 100px");
                height: 100%;
            }
        }
    }
</style>
<template>
    <div class="mini-info">
        <Card :bordered="true" class="config-height">
            <p slot="title">快手小程序配置</p>
            <Divider orientation="left">轮播图配置</Divider>
            <Row :gutter="rowGutter" class="banner-list">
                <Col span="6" v-for="v,i in bannerList">
                    <div class="banner-item el-center-list">
                        <img @click="openImg(`${v.val}`)" :src="v.val?v.val:imgIcon" />
                        <Button style="margin-top: 10px;" type="primary" size="small" @click="imgClickBanner(i)"><Icon type="md-cloud-upload" /> 上传图片</Button>
                    </div>
                </Col>
            </Row>
            <Divider orientation="left">主页宣传图配置</Divider>
            <Row :gutter="rowGutter" class="home-list">
                <Col span="6" v-for="v,i in homeList">
                    <div class="home-item el-center-list">
                        <img @click="openImg(`${v.val}`)" :src="v.val?v.val:imgIcon" />
                        <Button style="margin-top: 10px;" type="primary" size="small" @click="imgClickHome(i)"><Icon type="md-cloud-upload" /> 上传图片</Button>
                    </div>
                </Col>
            </Row>
            <Divider orientation="left">主页视频配置</Divider>
            <Row :gutter="rowGutter" class="video-list">
                <Col span="12" v-for="v,i in videoList">
                    <div class="video-item el-center-list">
                        <uploadFile ref="homeVideoRef" :size="500 * 1024" item="ksys" module="home" type="videoSing"
                        @fileResult="videoResult" @videoTimeResult="videoTimeResult" @filePro="videoProResult"></uploadFile>
                        <Progress v-if="videoPerShow" style="margin-top: 10px;" :percent="videoPer" :stroke-color="['#108ee9', '#87d068']" ></Progress>
                    </div>
                </Col>
            </Row>
            <Divider orientation="left">视频配置</Divider>
            <Row :gutter="rowGutter">
                <Col span="12">
                    <div class="input-item">
                        <div class="input-label red-star">视频声明：</div>
                        <div class="input-content">
                            <Input v-model="videoStatement.val" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="视频声明"></Input>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row :gutter="rowGutter">
                <Button type="info" @click="saveVideoStatement">保存</Button>
            </Row>
        </Card>
        <uploadFile style="display: none;" ref="uploadImg" :size="5 * 1024" item="ksys" module="mini" type="imgSing" @fileResult="imgResult" ></uploadFile>
        <mediaSee ref="mediaSee"></mediaSee>
    </div>
</template>
<script>
import imgIcon from '@/assets/images/icon/img.png'
import { getBanners, getHomeImgs, getHomeVideos, getVideoStatement, updateApi } from '@/api/gconfig'
import uploadFile from '_c/upload/uploadFile.vue'
export default {
  name: 'sysConfig',
  components: {
    uploadFile
  },
  props: {

  },
  data () {
    return {
      authMap: {},
      imgIcon,
      rowGutter: 10,
      bannerList: [],
      nowBanner: -1,
      homeList: [],
      nowHome: -1,
      videoList: [],
      nowVideo: -1,
      videoPer: 0,
      videoPerShow: false,
      videoStatement: {}
    }
  },
  computed: {

  },
  created () {},
  mounted () {
    this.authMap = this.$store.state.user.userInfo.authMap
    this.init()
  },
  methods: {
    init () {
      this.getData()
    },
    getData () {
      let _that = this
      getBanners().then(res => {
        let d = res.data
        _that.bannerList = d
      })
      getHomeImgs().then(res => {
        let d = res.data
        _that.homeList = d
      })
      getHomeVideos().then(res => {
        let d = res.data
        _that.videoList = d
      })
      getVideoStatement().then(res => {
        let d = res.data
        _that.videoStatement = d
      })
    },
    openImg (url) {
      if (!url) {
        this.$Message.warning('未上传')
        return
      }
      this.$refs.mediaSee.open(url)
    },
    imgClickBanner (n) {
      this.nowBanner = n
      this.nowHome = -1
      this.nowVideo = -1
      this.$refs.uploadImg.clickFile()
    },
    imgClickHome (n) {
      this.nowBanner = -1
      this.nowHome = n
      this.nowVideo = -1
      this.$refs.uploadImg.clickFile()
    },
    imgResult (v) {
      this.updateData(v)
    },
    videoResult (v) {
      this.nowBanner = -1
      this.nowHome = -1
      this.nowVideo = 0
      this.updateData(v)
    },
    videoTimeResult (v) {
      if (v != null) {

      }
    },
    videoProResult (v) {
      v = parseFloat(v)
      this.videoPer = v
      if (v < 100) {
        this.videoPerShow = true
      } else {
        this.videoPerShow = false
      }
    },
    updateData (url) {
      let _that = this
      let d = null
      if (this.nowBanner > -1) {
        d = { ...this.bannerList[this.nowBanner] }
      } else if (this.nowHome > -1) {
        d = { ...this.homeList[this.nowHome] }
      } else if (this.nowVideo > -1) {
        d = { ...this.videoList[this.nowVideo] }
      }
      d.val = url
      updateApi(d).then(res => {
        _that.cashLoading = false
        _that.$Message.success('修改成功')
        _that.getData()
      })
    },
    saveVideoStatement () {
      let _that = this
      let d = { ...this.videoStatement }
      updateApi(d).then(res => {
        _that.cashLoading = false
        _that.$Message.success('修改成功')
        _that.getData()
      })
    }
  }
}
</script>
