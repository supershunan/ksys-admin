<template>
    <div>
        <Card>
            <template #title>
                <span class="notice_title">教程</span>
            </template>
            <Button type="primary" @click="addVideo">添加视频</Button>
            <div class="video_list">
              <div class="video_item" v-for="item in videoData" :key="item.id">
                <video :src="item.val" height="200" width="200" controls></video>
                <Button type="error" size="small" @click="remove(row)" style="margin-top: 10px;">删除</Button>
              </div>
            </div>
        </Card>
        <Modal
            v-model="videoModal"
            title="添加视频"
            @on-ok="handleOk"
            @on-cancel="handleCancel">
            <div>
                <uploadFile ref="uploadVideo" :size="500 * 1024" item="ksys" module="works" type="videoSing"
                    @fileResult="videoResult" @videoTimeResult="videoTimeResult" @filePro="videoProResult"></uploadFile>
                <Progress v-if="videoPerShow" style="margin-top: 10px;" :percent="videoPer" :stroke-color="['#108ee9', '#87d068']" ></Progress>
            </div>
        </Modal>
    </div>
</template>

<script>
import uploadFile from '_c/upload/uploadFile.vue'
import { getDeviceList, addDevice, deleteDevice } from '@/api/expertEnd'
export default {
  components: {
    uploadFile
  },
  data () {
    return {
      videoModal: false,
      playUrl: '',
      videoPer: 0,
      videoPerShow: false,
      videoData: []
    }
  },
  mounted () {
    this.getVideoList()
  },
  methods: {
    getVideoList () {
      getDeviceList('use_video').then(res => {
        this.videoData = res.data
      })
    },
    addVideo () {
      this.videoModal = true
    },
    handleOk () {
      const data = {
        code: `use_video${this.videoData.length + 1}`,
        name: `使用教程${this.videoData.length + 1}`,
        val: this.playUrl,
        type: 'use_video'
      }
      addDevice(data).then(res => {
        this.$Message.info('添加成功')
        this.playUrl = ''
        this.getVideoList()
        this.videoModal = false
      })
    },
    handleCancel () {
      this.playUrl = ''
      this.videoModal = false
    },
    videoResult (v) {
      this.playUrl = v
    },
    videoTimeResult (v) {
      if (v != null) {
        this.playTime = v
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
    remove (item) {
      this.$Modal.confirm({
        title: '是否删除？',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          deleteDevice(item.id).then(() => {
            this.getVideoList()
            this.$Message.info('删除成功')
          })
        },
        onCancel: () => {
          this.$Message.info('取消')
        }
      })
    }
  }
}
</script>

<style scoped>
.notice_title {
  font-size: 20px;
  font-weight: bolder;
}
.video_list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 20px;
}
.video_item {
  display: flex;
  flex-flow: column;
  align-items: center;
  margin-bottom: 5px;
}
</style>
