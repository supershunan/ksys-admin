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
              @on-cancel="cancelBanner"
            >
              <div v-show="isChoose">
                <chooseSourceMaterial @chooseSource="chooseSource" @goBack="goBack" />
              </div>
              <div  v-show="!isChoose">
                <div>
                  <Input v-model="currentUploadImg" placeholder="请选择图片地址" style="width: 300px" />
                  <Button @click="goChoose">选择</Button>
                </div>
                <img v-if="currentUploadImg || currentBanner.val" width="200" height="150" :src="currentUploadImg  || currentBanner.val" />
              </div>
            </Modal>
        </Card>
        <Card>
            <template #title>
                <span class="notice_title">公告栏</span>
            </template>
            <div>
                <div style="display: flex; align-items: center;">
                    <span style="min-width: 80px;">公告内容：</span>
                    <Input v-model="bulletinBoard.val" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入公告"></Input>
                </div>
                <div style="display: flex; justify-content: end; margin-top: 5px;">
                    <Button type="primary" @click="editAdvertisment">保存</Button>
                </div>
            </div>
        </Card>
        <Card>
            <template #title>
                <span class="notice_title">公告历史</span>
            </template>
            <Table border :columns="advertismentHistoryColumns" :data="advertismentHistoryData">
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="error" size="small" @click="remove(row)">删除</Button>
                </template>
            </Table>
            <Page :total="total" show-sizer @on-change="pageCange" @on-page-size-change="pageSizeChange" />
        </Card>
        <mediaSee ref="mediaSee"></mediaSee>
    </div>
</template>

<script>
import uploadFile from '_c/upload/uploadFile.vue'
import chooseSourceMaterial from '_c/chooseSourceMaterial/chooseSourceMaterial.vue'
import { getDeviceList, addDevice, updateDevice, deleteDevice, getDeviceListPage } from '@/api/expertEnd'
import { timeFmt } from '@/libs/util'
export default {
  components: {
    uploadFile,
    chooseSourceMaterial
  },
  data () {
    return {
      bannerList: [],
      bannerVisibility: false,
      currentUploadImg: '',
      currentBanner: {},
      bannerBtnType: '',
      bulletinBoard: {},
      advertismentHistoryColumns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '内容',
          align: 'center',
          key: 'val'
        },
        {
          title: '时间',
          align: 'center',
          width: 200,
          key: 'createTime',
          render: (h, params) => {
            let d = params.row
            let txt = timeFmt(d.createTime)
            return h('div', txt)
          }
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      advertismentHistoryData: [],
      advertismentHistoryParams: {
        page: 1,
        rows: 5,
        type: 'advertisement'
      },
      advertismentModal: false,
      advertismentHistoryTotal: 0,
      isChoose: false
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
      this.getAdvertisement()
      this.getAdvertismentHistoryList()
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
    getAdvertisement () {
      getDeviceList('advertisement').then(res => {
        if (res.data.length) {
          this.bulletinBoard = res.data[0]
        }
      })
    },
    editAdvertisment () {
      const data = {
        code: 'advertisement',
        name: '公告栏',
        val: this.bulletinBoard.val,
        type: 'advertisement'
      }
      addDevice(data).then(() => {
        this.getAdvertisement()
        this.getAdvertismentHistoryList()
        this.$Message.success('添加公告成功')
      })
    },
    getAdvertismentHistoryList () {
      getDeviceListPage(
        this.advertismentHistoryParams.type,
        this.advertismentHistoryParams.page,
        this.advertismentHistoryParams.rows
      ).then(res => {
        this.advertismentHistoryData = res.rows.slice(1)
        this.advertismentHistoryTotal = res.total
      })
    },
    remove (item) {
      this.$Modal.confirm({
        title: '是否删除？',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          deleteDevice(item.id).then(res => {
            this.getAdvertismentHistoryList()
            this.$Message.info('删除成功')
          })
        },
        onCancel: () => {
          this.$Message.info('Clicked cancel')
        }
      })
    },
    pageCange (index) {
      this.advertismentHistoryParams.rows = index
      this.getAdvertismentHistoryList()
    },
    pageSizeChange (index) {
      this.advertismentHistoryParams.rows = index
      this.getAdvertismentHistoryList()
    },
    chooseSource (item) {
      this.currentUploadImg = item.url
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
