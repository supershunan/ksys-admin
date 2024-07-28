<template>
    <div>
        <Card>
            <template #title>
                <span class="notice_title">教程</span>
            </template>
            <div>
                <Button type="primary" @click="addVideo" style="margin-bottom: 20px;">添加视频</Button>
                <Table border :columns="columns1" :data="data1">
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="error" size="small" @click="remove(index)">删除</Button>
                </template>
            </Table>
            </div>
        </Card>
        <Modal
            v-model="videoModal"
            title="添加视频"
            @on-ok="ok"
            @on-cancel="cancel">
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
      columns1: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '内容',
          align: 'center',
          key: 'name'
        },
        {
          title: '时间',
          align: 'center',
          width: 100,
          key: 'date'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      data1: [
        {
          name: 'John Brown',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          date: '2016-10-04'
        }
      ]
    }
  },
  methods: {
    addVideo () {
      this.videoModal = true
    },
    ok () {
      this.$Message.info('Clicked ok')
      this.videoModal = false
    },
    cancel () {
      this.$Message.info('Clicked cancel')
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
    remove (index) {
    //   this.data6.splice(index, 1)
      this.$Modal.confirm({
        title: '是否删除？',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          this.$Message.info('Clicked ok')
        },
        onCancel: () => {
          this.$Message.info('Clicked cancel')
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
</style>
