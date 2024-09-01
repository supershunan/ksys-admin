<style lang="less" scoped>
.works-detail {
    .video-name {
        width: calc(~'100% - 80px');
        padding-left: 80px;
    }
    .video-item {
        width: 100%;
        height: 600px;
        video {
            width: 1000px;
            height: 600px;
        }
    }
    .video-info {
        height: 260px;
        line-height: 3;
    }
}
</style>
<template>
    <Modal class="works-detail" v-model="modalShow" :title="modalTitle" width="1200" :styles="{ top:'20px' }">
        <Row :gutter="rowGutter">
          <div class="video-name">
            <h1>标题：{{ videoName }}</h1>
          </div>
        </Row>
        <Row class="margin-top10" :gutter="rowGutter">
          <div class="video-name">
            <Tag v-for="v,i in labelList" color="magenta">{{ v.name }}</Tag>
          </div>
        </Row>
        <Row class="margin-top10" :gutter="rowGutter">
          <div class="video-item el-center-list">
            <video :src="videoUrl" :poster="videoCoverImg" controls ></video>
          </div>
        </Row>
        <Row class="margin-top10" :gutter="rowGutter">
          <Col span="24">
            <Card :bordered="true">
              <p slot="title">视频数据</p>
              <p class="video-info">
                <Row :gutter="rowGutter">
                  <Col span="6">
                     视频编号：{{ checkTxtDef(dataForm.code) }}
                  </Col>
                  <Col span="6">
                     视频时长：{{ checkTxtDef(dataForm.playTime) }}
                  </Col>
                  <Col span="6">
                     视频播放量：{{ checkTxtDef(dataForm.playCount) }}
                  </Col>
                  <Col span="6">
                     视频购买量：{{ checkTxtDef(dataForm.playBuy) }}
                  </Col>
                  <Col span="6">
                     价格：{{ checkTxtDef(dataForm.money,'0') }}元
                  </Col>
                  <Col span="6">
                     可观看时长：{{ checkTxtDef(dataForm.useTime,'0') }}小时
                  </Col>
                  <Col span="6">
                     排序：{{ checkTxtDef(dataForm.sort) }}
                  </Col>
                  <Col span="6">
                    状态：<Tag :color="videoStatusMap[dataForm.status].c">{{ videoStatusMap[dataForm.status].v }}</Tag>
                  </Col>
                  <Col span="24">
                     简介：{{ checkTxtDef(dataForm.info) }}
                  </Col>
                  <!-- <Col span="6">
                     总产生收益：<span class="text-blue">{{ dataForm.incomData?checkTxtDef(dataForm.incomData.totalMoney,'0'):'0' }}</span> 元
                  </Col>
                  <Col span="6">
                     分红：<span class="text-blue">{{ dataForm.incomData?checkTxtDef(dataForm.incomData.totalShareMoney,'0'):'0' }}</span> 元
                  </Col> -->
                  <Col span="6">
                     所得收益：<span class="text-red">{{ dataForm.incomData?checkTxtDef(dataForm.incomData.totalIncomeMoney,'0'):'0' }}</span> 元
                  </Col>
                </Row>
              </p>
            </Card>
          </Col>
        </Row>
        <Row class="margin-top10" :gutter="rowGutter">
          <Divider orientation="left">视频宣传背景图</Divider>
          <p class="el-center-list">
            <img :src="videoBgImg" />
          </p>
        </Row>
        <div slot="footer">
            <Button size="large" @click="moduleClose">关闭</Button>
        </div>
    </Modal>
</template>
<script>
import { infoAllData } from '@/api/works'
import { checkWorkListtApi } from '@/api/videoReview'
import { checkTxt, checkTxtDef, timeFmt } from '@/libs/util'
import { worksTypeMap, videoStatusMap } from '@/libs/dict'
export default {
  name: '',
  components: {

  },
  props: {

  },
  data () {
    return {
      checkTxt,
      checkTxtDef,
      timeFmt,
      worksTypeMap,
      videoStatusMap,
      modalShow: false,
      modalTitle: '视频详情',
      rowGutter: 10,
      dataForm: {},
      videoName: '',
      videoUrl: '',
      videoCoverImg: '',
      videoBgImg: '',
      labelList: []
    }
  },
  computed: {

  },
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {

    },
    open (code) {
      this.modalShow = true
      this.videoName = ''
      this.videoUrl = ''
      this.videoCoverImg = ''
      this.videoBgImg = ''
      this.dataForm = {}
      this.labelList = []
      this.getInfo(code)
    },
    getInfo (code) {
      let _that = this
      checkWorkListtApi({
        code: code,
        type: 'video',
        page: 1,
        rows: 1
      }).then(res => {
        let d = res.rows[0]
        _that.dataForm = d
        _that.labelList = d.labelDataList
        _that.videoName = d.title
        _that.videoCoverImg = d.coverImg
        _that.videoUrl = d.playUrl
        _that.videoBgImg = d.bgImg
      })
    },
    moduleClose () {
      this.modalShow = false
    }
  }
}
</script>
