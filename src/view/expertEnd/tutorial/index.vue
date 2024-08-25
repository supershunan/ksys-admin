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
              <div v-show="isChoose">
                <chooseSourceMaterial @chooseSource="chooseSource" @goBack="goBack" />
              </div>
              <div  v-show="!isChoose">
                <div>
                  <Input v-model="playUrl" placeholder="请选择视频地址" style="width: 300px" />
                  <Button @click="goChoose">选择</Button>
                </div>
                <video v-if="playUrl" width="200" height="150" :src="playUrl" />
              </div>
            </div>
        </Modal>
    </div>
</template>

<script>
import chooseSourceMaterial from '_c/chooseSourceMaterial/chooseSourceMaterial.vue'
import { getDeviceList, addDevice, deleteDevice } from '@/api/expertEnd'
export default {
  components: {
    chooseSourceMaterial
  },
  data () {
    return {
      videoModal: false,
      playUrl: '',
      videoData: [],
      isChoose: false
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
    },
    chooseSource (item) {
      this.playUrl = item.url
    },
    goBack () {
      this.isChoose = false
    },
    goChoose () {
      this.isChoose = true
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
