<template>
    <div>
        <Card>
            <template #title>
                <span class="notice_title">轮播图</span>
            </template>
            <div>
              <Button type="primary" @click="addBannerImg('add')">添加轮播图</Button>
              <div class="img_list">
                <div class="img_item" v-for="item in bannerList" :key="item.id">
                  <img @click="openImg(`${item.val}`)" :src="item.val" width="200" height="150" />
                  <div class="img-item-btns">
                    <Button type="success" @click="updateBannerImg(item, 'update')" size="small" style="margin-right: 10px;">更新</Button>
                    <Button type="error" @click="deleteBannerImg(item)" size="small">删除</Button>
                  </div>
                </div>
              </div>
            </div>
            <Modal
                v-model="bannerVisibility"
                :title="bannerBtnType === 'add' ? '添加轮播图' : '更新轮播图'"
                @on-ok="bannerOk"
                @on-cancel="cancelBanner">
                <img v-if="currentUploadImg || currentBanner.val" width="200" height="150" :src="currentUploadImg  || currentBanner.val" />
                <Button style="margin-top: 10px;" type="primary" size="small" @click="imgUploadBanner"><Icon type="md-cloud-upload" /> 上传图片</Button>
            </Modal>
        </Card>
        <Card>
            <template #title>
                <span class="notice_title">公告栏</span>
            </template>
            <div>
                <div style="display: flex; align-items: center;">
                    <span style="min-width: 80px;">公告内容：</span>
                    <Input v-model="bulletinBoard" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入公告"></Input>
                </div>
                <div style="display: flex; justify-content: end; margin-top: 5px;">
                    <Button type="primary">保存</Button>
                </div>
            </div>
        </Card>
        <Card>
            <template #title>
                <span class="notice_title">公告历史</span>
            </template>
            <Button type="primary" @click="modal1 = true">添加公告</Button>
            <Table border :columns="columns1" :data="data1">
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="error" size="small" @click="remove(index)">删除</Button>
                </template>
            </Table>
            <Page :total="total" show-sizer @on-change="pageCange" @on-page-size-change="pageSizeChange" />
            <Modal
                v-model="modal1"
                title="公告内容"
                @on-ok="ok"
                @on-cancel="cancel">
                <Input v-model="value5" type="textarea" placeholder="Enter something..." />
            </Modal>
        </Card>
        <uploadFile style="display: none;" ref="uploadImg" :size="5 * 1024" item="ksys" module="mini" type="imgSing" @fileResult="imgResult" ></uploadFile>
        <mediaSee ref="mediaSee"></mediaSee>
    </div>
</template>

<script>
import uploadFile from '_c/upload/uploadFile.vue'
import { getDeviceList, addDevice, updateDevice, deleteDevice } from '@/api/expertEnd'
export default {
  components: {
    uploadFile
  },
  data () {
    return {
      bannerList: [],
      bannerVisibility: false,
      currentUploadImg: '',
      currentBanner: {},
      bannerBtnType: '',
      bulletinBoard: '公告栏',
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
      ],
      modal1: false,
      value5: 'John',
      total: 100
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
      this.getBannerList()
    },
    imgResult (v) {
      this.currentUploadImg = v
    },
    getBannerList () {
      getDeviceList('banner').then(res => {
        this.bannerList = res.data
      })
    },
    addBannerImg (btnType) {
      this.bannerBtnType = btnType
      this.bannerVisibility = true
    },
    updateBannerImg (item, btnType) {
      this.currentBanner = item
      this.bannerBtnType = btnType
      this.bannerVisibility = true
    },
    deleteBannerImg (item) {
      this.$Modal.confirm({
        title: '是否删除？',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          deleteDevice(item.id).then(res => {
            this.getBannerList()
            this.$Message.info('删除成功')
          })
        },
        onCancel: () => {
          this.$Message.info('取消')
        }
      })
    },
    bannerOk () {
      if (this.bannerBtnType === 'add') {
        const data = {
          val: this.currentUploadImg,
          type: 'banner',
          code: `banner${this.bannerList.length + 1}`,
          name: `轮播图${this.bannerList.length + 1}`
        }
        addDevice(data).then(res => {
          this.$Message.success('添加成功')
          this.currentUploadImg = ''
          this.getBannerList()
          this.bannerVisibility = false
        })
      }

      if (this.bannerBtnType === 'update') {
        const data = {
          ...this.currentBanner,
          val: this.currentUploadImg
        }
        updateDevice(data).then(res => {
          this.$Message.success('更新成功')
          this.currentBanner = {}
          this.currentUploadImg = ''
          this.getBannerList()
          this.bannerVisibility = false
        })
      }
    },
    cancelBanner () {
      this.currentBanner = {}
      this.currentUploadImg = ''
      this.bannerVisibility = false
    },
    openImg (url) {
      if (!url) {
        this.$Message.warning('未上传')
        return
      }
      this.$refs.mediaSee.open(url)
    },
    imgUploadBanner () {
      this.$refs.uploadImg.clickFile()
    },
    ok () {
      this.$Message.info('Clicked ok')
    },
    cancel () {
      this.$Message.info('Clicked cancel')
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
    },
    pageCange (index) {
      console.log(index)
    },
    pageSizeChange (index) {
      console.log(index)
    }
  }
}
</script>

<style scoped>
.notice_title {
  font-size: 20px;
  font-weight: bolder;
}
.img_list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 20px;
}
.img_item {
  display: flex;
  flex-flow: column;
  align-items: center;
  margin-bottom: 5px;
}
</style>
