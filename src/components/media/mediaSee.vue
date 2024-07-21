<style lang="less" scoped>
    .modal-item {
        /deep/ .ivu-modal-content {
            background-color: rgba(0,0,0,0);
            box-shadow: none;
            -webkit-box-shadow: none;
        }
        /deep/ .ivu-modal-close {
            background-color: white;
            color: grey;
            border-radius: 50%;
        }
    }
    .home-item {
        height: 100%;
        width: 100%;
        .home-row {
            width: 1500px;
            height: 800px;
            .home-col {
                height: 100%;
                .change-btn {
                    width: 100%;
                    height: 100%;
                    i {
                        cursor: pointer;
                    }
                }
                .content {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
</style>
<template>
    <Modal class="modal-item" v-model="modalShow" :styles="modalStyles" footer-hide>
        <div class="home-item el-center-list">
            <Row class="home-row" :gutter="rowGutter">
                <Col class="home-col" span="4">
                    <div class="change-btn el-center-list">
                        <Icon v-if="btnShow" @click="lastData" size="50" color="white" type="md-arrow-dropleft-circle" />
                    </div>
                </Col>
                <Col class="home-col" span="16">
                    <div class="content el-center-list">
                        <img v-if="dataType == 'img'" :src="nowUrl" :style="{width: imageStyle.width, height: imageStyle.height}" @load="handleImageLoad" />
                        <video v-else-if="dataType == 'video'" :src="videoUrl" :width="maxWidth" :height="maxHeight" :poster="videoCoverImg" controls ></video>
                    </div>
                </Col>
                <Col class="home-col" span="4">
                    <div class="change-btn el-center-list">
                        <Icon v-if="btnShow" @click="nextData" size="50" color="white" type="md-arrow-dropright-circle" />
                    </div>
                </Col>
            </Row>
        </div>
    </Modal>
</template>
<script>
import imgIcon from  "@/assets/images/icon/img.png"
export default {
  name: '',
  components: {

  },
  props: {
    
  },
  data() {
    return {
        modalShow: false,
        rowGutter: 10,
        modalStyles: { width:"80%",top:"20px" }, 
        maxWidth: 800,
        maxHeight: 800,
        imageStyle: { width: `800px`, height: `600px` },
        btnShow: false,
        nowUrl: imgIcon,
        dataList: [],
        dataNum: 0,
        videoUrl: "",
        videoCoverImg: "",
        dataType: 'img',
    };
  },
  computed: {
    
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      
    },
    moduleClose() {
        this.modalShow = false
    },
    open(url) {
        this.nowUrl = url
        this.dataType = "img"
        this.btnShow = false
        this.modalShow = true
    },
    openList(list) {
        if (list != null && list.length > 0) {
            this.nowUrl = list[0].url
        }
        this.dataNum = 0
        this.dataList = list
        this.dataType = "img"
        this.btnShow = true
        this.modalShow = true
    },
    openVideo(url,coverUrl) {
        this.videoUrl = url
        this.videoCoverImg = coverUrl
        this.dataType = "video"
        this.btnShow = false
        this.modalShow = true
    },
    handleImageLoad(event) {
        const img = event.target;
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        if (!(naturalWidth > this.maxWidth || naturalHeight > this.maxHeight)) {
            this.imageStyle.width = `${naturalWidth}px`;
            this.imageStyle.height = `${naturalHeight}px`;
            return
        }
        const ratio = Math.min(this.maxWidth / naturalWidth, this.maxHeight / naturalHeight);
        this.imageStyle.width = `${Math.floor(naturalWidth * ratio)}px`;
        this.imageStyle.height = `${Math.floor(naturalHeight * ratio)}px`;
    },
    lastData() {
        let num = this.dataNum
        if (num == 0) {
            this.$Message.warning("已经到第一张了")
            return
        }
        num -= 1
        this.nowUrl = this.dataList[num].url
        this.dataNum = num
    },
    nextData() {
        let num = this.dataNum
        if (num == this.dataList.length-1) {
            this.$Message.warning("已经到最后一张了")
            return
        }
        num += 1
        this.nowUrl = this.dataList[num].url
        this.dataNum = num
    },
  },
};
</script>