<template>
  <div class="content">
    <div class="left-content">
        <Button type="primary">添加分组</Button>
        <Card style="min-width: 300px; margin-top: 10px;">
            <div class="group-item" v-for="group in groupNames" :key="group.key">
                <div class="item-name">
                    <Icon type="ios-paper-outline" />
                    <span style="margin-left: 10px;">{{ group.name }}</span>
                </div>
                <div class="item-action">
                    <span class="item-edit" @click="groupEdit">编辑</span>
                    <Divider type="vertical" />
                    <span class="item-delete" @click="groupDelete">删除</span>
                </div>
            </div>
        </Card>
    </div>
    <div class="right-content">
        <div class="right-content-top">
            <div class="group-title">全部</div>
            <div class="right-action">
                <div>
                    <Input search enter-button placeholder="请输入名称搜索" />
                </div>
                <Button type="primary" style="margin: 0 10px;">批量删除</Button>
                <Dropdown trigger="click">
                    <a href="javascript:void(0)">
                        移动至
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem v-for="group in groupNames" :key="group.key">{{ group.name }}</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
        <Card style="margin-top: 10px;">
          <Button style="margin-top: 5px;" type="primary" size="small" @click="addImgOrVideo">
            <Icon type="md-cloud-upload" />上传{{ currentTabName }}
          </Button>
          <Table border :columns="columns1" :data="data1">
              <template slot-scope="{ row, index }" slot="action">
                  <Button type="warning" size="small" @click="edit(index)">编辑</Button>
                  <Button type="error" size="small" @click="remove(index)">删除</Button>
              </template>
          </Table>
          <Page :total="total" show-sizer @on-change="pageCange" @on-page-size-change="pageSizeChange" />
        </Card>
    </div>

    <Modal
      v-model="modal1"
      title="编辑"
      @on-ok="ok"
      @on-cancel="cancel">
        图片名称：<Input v-model="value5" />
    </Modal>

    <Modal
      v-model="picvideoModal"
      :title="'添加'+currentTabName"
      @on-ok="ok"
      @on-cancel="cancel">
      <div>
        <!-- 图片 -->
        <div v-show="currentTabName === '图片'">
          <img style="width: 200px;" @click="imgClick" :src="imgUrl" />
          <uploadFile style="display: none;" ref="uploadImg" :size="5 * 1024" item="ksys" module="works" type="imgSing"
            @fileResult="imgResult" ></uploadFile>
        </div>
        <!-- 视频 -->
        <div v-show="currentTabName === '视频'">
          <uploadFile ref="uploadVideo" :size="500 * 1024" item="ksys" module="works" type="videoSing"
            @fileResult="videoResult" @videoTimeResult="videoTimeResult" @filePro="videoProResult"></uploadFile>
          <Progress v-if="videoPerShow" style="margin-top: 10px;" :percent="videoPer" :stroke-color="['#108ee9', '#87d068']" ></Progress>
        </div>
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
  props: {
    currentTabName: {
      type: String,
      default: '图片'
    }
  },
  data () {
    return {
      groupNames: [
        {
          key: 0,
          name: '全部'
        },
        {
          key: 1,
          name: '广告页'
        },
        {
          key: 2,
          name: '图标'
        },
        {
          key: 3,
          name: '个人中心'
        }
      ],
      columns1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '素材',
          align: 'center',
          key: 'avatar',
          render: (h, params) => {
            let d = params.row
            let url = d.avatar ? d.avatar : imgIcon
            return h('div', { attrs: { class: 'table-img' } }, [h('img', { attrs: { src: url } }, '')])
          }
        },
        {
          title: '时间',
          align: 'center',
          key: 'date'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      data1: [
        {
          name: '16888',
          avatar: 'https://file.qfyingshi.cn/app/ksys/works/d9c20a19-816e-4d1a-bc27-7259b89dbc2c.png',
          date: '2016-10-03'
        },
        {
          name: '16888',
          avatar: 'https://file.qfyingshi.cn/app/ksys/works/d9c20a19-816e-4d1a-bc27-7259b89dbc2c.png',
          date: '2016-10-01'
        },
        {
          name: '16888',
          avatar: 'https://file.qfyingshi.cn/app/ksys/works/d9c20a19-816e-4d1a-bc27-7259b89dbc2c.png',
          date: '2016-10-02'
        },
        {
          name: '16888',
          avatar: 'https://file.qfyingshi.cn/app/ksys/works/d9c20a19-816e-4d1a-bc27-7259b89dbc2c.png',
          date: '2016-10-04'
        }
      ],
      total: 100,
      modal1: false,
      imgUrl: 'https://file.qfyingshi.cn/app/ksys/works/d9c20a19-816e-4d1a-bc27-7259b89dbc2c.png',
      picvideoModal: false,
      playUrl: '',
      videoPer: 0,
      videoPerShow: false
    }
  },
  methods: {
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
    },
    edit () {
      this.modal1 = true
    },
    groupEdit () {

    },
    groupDelete () {

    },
    ok () {
      this.modal1 = false
      this.picvideoModal = false
    },
    cancel () {
      this.modal1 = false
      this.picvideoModal = false
    },
    addImgOrVideo () {
      this.picvideoModal = true
    },
    imgClick () {
      this.$refs.uploadImg.clickFile()
    },
    imgResult (v) {
      this.imgUrl = v
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
    }
  }
}
</script>
<style lang="less" scoped>
.content {
  display: flex;
  .left-content {
      .group-item {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          .item-name {
              display: flex;
              align-items: center;
              cursor: pointer;
          }
          .item-action {
              user-select: none;
              .item-edit {
                  cursor: pointer;
                  color: #2d8cf0;
              }
              .item-edit:hover {
                  color: #0973e5;
              }
              .item-edit:active {
                  color: #004691;
              }
              .item-delete {
                  cursor: pointer;
                  color: #2d8cf0;
              }
              .item-delete:hover {
                  color: #0973e5;
              }
              .item-delete:active {
                  color: #004691;
              }
          }
      }
      .group-item:nth-child(1) {
          margin-top: 0;
      }
  }
  .right-content {
      flex: 1;
      margin-left: 10px;
      .right-content-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .right-action {
              display: flex;
              align-items: center;
          }
      }
  }
}
</style>
