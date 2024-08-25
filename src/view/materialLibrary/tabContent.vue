<template>
  <div class="content">
    <div class="left-content">
        <Button type="primary" @click="addClassify" v-show="isMaterialLibrary">添加分组</Button>
        <Card style="min-width: 300px; margin-top: 10px;">
            <div
              class="group-item"
              v-for="group in groupNames"
              :key="group.key"
              :style="{background: currentClassify.name === group.name ? '#00000033' : ''}"
            >
                <div class="item-name" @click="chooseClassify(group)">
                    <Icon type="ios-paper-outline" />
                    <span style="margin-left: 10px;">{{ group.name }}</span>
                </div>
                <div class="item-action">
                    <Button v-if="isMaterialLibrary" type="text" class="item-edit" @click="groupEdit(group)" style="background-color: #ffffff00; color: #0973e5;">编辑</Button>
                    <Button  v-else type="text" @click="groupRecovery(group, 'group')" :disabled="group.state === 1" style="background-color: #ffffff00; color: #0973e5;">恢复</Button>
                    <Divider type="vertical" />
                    <Button :disabled="group.state === 1 && !isMaterialLibrary" type="text" @click="groupDelete(group)" style="background-color: #ffffff00; color: #0973e5;">删除</Button>
                </div>
            </div>
        </Card>
    </div>
    <div class="right-content">
        <div class="right-content-top">
            <div class="group-title">{{ currentClassify.name }}</div>
            <div class="right-action">
                <div>
                    <Input search enter-button placeholder="请输入名称搜索" @on-search="handleSearch" />
                </div>
                <Button v-show="!isMaterialLibrary" type="success" style="margin: 0 10px;" @click="batchRecoverySource">批量恢复</Button>
                <Button type="primary" style="margin: 0 10px;" @click="batchDeleteSource">批量删除</Button>
                <Button v-show="!isMaterialLibrary" type="error" style="margin: 0 10px;" @click="emptyRecycleAll">全部删除</Button>
                <Dropdown trigger="click" v-show="isMaterialLibrary">
                    <a href="javascript:void(0)">
                        移动至
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem v-for="group in groupNames" :key="group.key" >
                          <span @click="moveSource(group)">{{ group.name }}</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
        <Card style="margin-top: 10px;">
          <Button style="margin-top: 5px;" type="primary" size="small" @click="addImgOrVideo">
            <Icon type="md-cloud-upload" />上传{{ currentTabName === 'pic' ? '图片' : '视频' }}
          </Button>
          <Table
            border
            :columns="sourceColumns"
            :data="sourceData"
            @on-select="onSelect"
            @on-select-cancel="onSelectCancel"
            @on-select-all="onSelectAll"
            @on-select-all-cancel="onSelectAllCancel"
          >
              <template slot-scope="{ row, index }" slot="action">
                  <Button v-if="isMaterialLibrary" type="warning" size="small" @click="edit(row)">编辑</Button>
                  <Button v-else type="success" size="small" @click="groupRecovery(row, 'source')">恢复</Button>
                  <Divider type="vertical" />
                  <Button type="success" size="small" @click="groupCopy(row)">复制地址</Button>
                  <Divider type="vertical" />
                  <Button type="error" size="small" @click="remove(row)">删除</Button>
              </template>
          </Table>
          <Page :total="total" show-sizer @on-change="pageCange" @on-page-size-change="pageSizeChange" />
        </Card>
    </div>

    <Modal
      v-model="groupingModal"
      :title="groupStatus === 'add' ? '添加分组' : '编辑分组'"
      @on-ok="groupingOk"
      @on-cancel="groupingcancel">
        分组名称：<Input v-model="groupingValue" />
    </Modal>

    <Modal
      v-model="editModal"
      title="编辑"
      @on-ok="editOk"
      @on-cancel="eidtCancel">
        图片名称：<Input v-model="currentSource.name" />
    </Modal>

    <Modal
      v-model="picvideoModal"
      :title="currentTabName === 'pic' ? '添加图片' : '添加视频'"
      @on-ok="sourceOk"
      @on-cancel="sourceCancel">
      <div>
        <!-- 图片 -->
        <div v-show="currentTabName === 'pic'">
          <Button type="primary" @click="imgClick">添加图片</Button>
          <img style="width: 200px;" @click="imgClick" :src="imgData.url" />
          <uploadFile style="display: none;" ref="uploadImg" :size="5 * 1024" item="ksys" module="works" type="imgSing"
            @fileResult="imgResult" ></uploadFile>
        </div>
        <!-- 视频 -->
        <div v-show="currentTabName === 'video'">
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
import { getClassifyListApi, addClassifyApi, deleteClassifyApi, updateClassifyApi, emptyRecycleBinApi } from '@/api/materialLibrary'
export default {
  components: {
    uploadFile
  },
  props: {
    currentTabName: {
      type: String,
      default: 'pic',
      required: true
    },
    isMaterialLibrary: {
      type: Boolean,
      default: true,
      required: true
    }
  },
  data () {
    return {
      groupingModal: false,
      groupingValue: '',
      groupNames: [],
      groupStatus: 'add',
      currentClassify: {},
      sourceColumns: [
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
          key: 'url',
          render: (h, params) => {
            let d = params.row
            let url = d.url
            return h(
              'div',
              { attrs: { class: 'table-img' } },
              [
                h(
                  this.currentTabName === 'pic' ? 'img' : 'video',
                  {
                    attrs: { src: url, controls: this.currentTabName === 'video' },
                    style: { width: '200px', height: '100px' }
                  },
                  ''
                )
              ]
            )
          }
        },
        {
          title: '操作',
          slot: 'action',
          width: 300,
          align: 'center'
        }
      ],
      sourceData: [],
      params: {
        page: 1,
        rows: 10
      },
      total: 0,
      editModal: false,
      currentSource: {},
      imgData: { url: '', name: '' },
      picvideoModal: false,
      playData: { url: '', name: '' },
      videoPer: 0,
      videoPerShow: false,
      seletedSource: []
    }
  },
  watch: {
    currentTabName: {
      handler: function (val, oldVal) {
        this.getClassifyList()
      },
      immediate: true
    },
    isMaterialLibrary: {
      handler: function (val, oldVal) {
        this.getClassifyList()
      },
      immediate: true
    }
  },
  mounted () {
  },
  methods: {
    getClassifyList () {
      getClassifyListApi({
        type: 'folder',
        category: this.currentTabName === 'pic' ? 1 : 2

      }).then(res => {
        if (res.rows.length > 0) {
          this.currentClassify = res.rows[0]
          this.groupNames = res.rows
        } else {
          this.currentClassify = {}
          this.groupNames = []
        }
        this.getClassifySourceList()
      })

      if (!this.isMaterialLibrary) {
        getClassifyListApi({
          type: 'folder',
          category: this.currentTabName === 'pic' ? 1 : 2,
          state: 2
        }).then(res => {
          this.groupNames = this.groupNames.concat(res.rows)
          this.getClassifySourceList()
        })
      }
    },
    getClassifySourceList (name) {
      if (this.currentClassify) {
        getClassifyListApi({
          name,
          state: this.isMaterialLibrary ? 1 : 2,
          pid: this.currentClassify.id,
          type: this.currentTabName,
          ...this.params
        }).then(res => {
          this.sourceData = res.rows
          this.total = res.total
        })
      }
    },
    addClassify () {
      this.groupingValue = ''
      this.groupStatus = 'add'
      this.groupingModal = true
    },
    groupingOk () {
      if (this.groupStatus === 'add') {
        addClassifyApi({
          name: this.groupingValue,
          category: this.currentTabName === 'pic' ? 1 : 2, // 1-图片 2-视频
          type: 'folder' // folder 文件夹  video 视频 pic 图片
        }).then(() => {
          this.getClassifyList()
        })
      }

      if (this.groupStatus === 'edit') {
        updateClassifyApi({ id: this.currentClassify.id, name: this.groupingValue }).then(() => {
          this.$Message.info('修改成功')
          this.getClassifyList()
        })
      }
      this.groupingModal = false
    },
    groupingcancel () {
      this.groupingModal = false
    },
    chooseClassify (item) {
      this.params = {
        page: 1,
        rows: 10
      }
      this.currentClassify = item
      this.getClassifySourceList()
    },
    groupEdit (item) {
      this.currentClassify = item
      this.groupingValue = item.name
      this.groupStatus = 'edit'
      this.groupingModal = true
    },
    groupRecovery (item, type) {
      this.$Modal.confirm({
        title: '是否恢复到素材库？',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          updateClassifyApi({ id: item.id, state: 1 }).then(() => {
            this.$Message.info('恢复成功')
            if (type === 'group') {
              this.getClassifyList()
            } else {
              this.getClassifySourceList()
            }
          })
        },
        onCancel: () => {
          this.$Message.info('恢复失败')
        }
      })
    },
    groupDelete (item) {
      this.$Modal.confirm({
        title: this.isMaterialLibrary ? '是否删除？' : '是否永久删除',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          console.log('wkkk', this.isMaterialLibrary)
          if (this.isMaterialLibrary) {
            deleteClassifyApi({ ids: item.id })
          }

          if (!this.isMaterialLibrary) {
            emptyRecycleBinApi({ ids: item.id })
          }

          this.getClassifyList()
          this.$Message.info('删除成功')
        },
        onCancel: () => {
          this.$Message.info('删除失败')
        }
      })
    },
    edit (item) {
      this.currentSource = { ...item }
      this.editModal = true
    },
    groupCopy (item) {
      console.log(item)
      const textToCopy = item.url // 你要复制的文本内容
      const textArea = document.createElement('textarea')

      textArea.value = textToCopy
      document.body.appendChild(textArea)

      textArea.select()
      textArea.setSelectionRange(0, textArea.value.length) // 兼容移动设备

      try {
        document.execCommand('copy')
        this.$Message.info('复制成功')
      } catch (err) {
        this.$Message.info('复制失败')
        console.error('复制失败', err)
      }
      document.body.removeChild(textArea) // 移除临时的textarea元素
    },
    remove (item) {
      this.$Modal.confirm({
        title: this.isMaterialLibrary ? '是否删除？' : '是否永久删除',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          if (this.isMaterialLibrary) {
            deleteClassifyApi({ ids: item.id }).then(res => {
              this.getClassifySourceList()
            })
          }

          if (!this.isMaterialLibrary) {
            emptyRecycleBinApi({ ids: item.id }).then(() => {
              this.getClassifySourceList()
            })
          }

          this.$Message.info('删除成功')
        },
        onCancel: () => {
          this.$Message.info('删除失败')
        }
      })
    },
    sourceOk () {
      addClassifyApi({
        name: this.currentTabName === 'pic' ? this.imgData.name : this.playData.name,
        url: this.currentTabName === 'pic' ? this.imgData.url : this.playData.url,
        category: this.currentClassify.category, // 1-图片 2-视频
        type: this.currentTabName, // folder 文件夹  video 视频 pic 图片
        pid: this.currentClassify.id
      }).then(() => {
        this.params = {
          page: 1,
          rows: 10
        }
        this.getClassifySourceList()
      })
      this.picvideoModal = false
    },
    editOk () {
      updateClassifyApi({ id: this.currentSource.id, name: this.currentSource.name }).then(() => {
        this.$Message.info('修改成功')
        this.getClassifySourceList()
        this.editModal = false
      })
    },
    pageCange (index) {
      this.params.rows = index
      this.getClassifySourceList()
    },
    pageSizeChange (index) {
      this.params.rows = index
      this.getClassifySourceList()
    },
    eidtCancel () {
      this.editModal = false
    },
    sourceCancel () {
      this.picvideoModal = false
    },
    onSelect (item) {
      this.seletedSource = item
    },
    onSelectCancel (item) {
      this.seletedSource = item
    },
    onSelectAll (item) {
      this.seletedSource = item
    },
    onSelectAllCancel (item) {
      this.seletedSource = item
    },
    handleSearch (value) {
      this.params = {
        page: 1,
        rows: 10
      }
      this.getClassifySourceList(value)
    },
    batchDeleteSource () {
      this.$Modal.confirm({
        title: this.isMaterialLibrary ? '是否批量删除？' : '是否批量永久删除',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          if (this.isMaterialLibrary) {
            const idsAry = this.seletedSource.map(item => item.id)
            deleteClassifyApi({ ids: idsAry.join(',') }).then(res => {
              this.getClassifySourceList()
            })
          }

          if (!this.isMaterialLibrary) {
            const idsAry = this.seletedSource.map(item => item.id)
            emptyRecycleBinApi({ ids: idsAry.join(',') }).then(res => {
              this.getClassifySourceList()
            })

            this.$Message.info('批量删除成功')
          }
        },
        onCancel: () => {
          this.$Message.info('批量删除失败')
        }
      })
    },
    batchRecoverySource () {
      this.$Modal.confirm({
        title: '是否批量恢复到素材库？',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          this.seletedSource.forEach(res => {
            updateClassifyApi({ id: res.id, state: 1 })
          })
          this.$Message.info('批量恢复成功')
          this.getClassifySourceList()
        },
        onCancel: () => {
          this.$Message.info('批量恢复失败')
        }
      })
    },
    emptyRecycleAll () {
      emptyRecycleBinApi({ })
    },
    moveSource (item) {
      this.seletedSource.forEach(source => {
        updateClassifyApi({ ...source, pid: item.id })
      })
    },
    addImgOrVideo () {
      this.picvideoModal = true
    },
    imgClick () {
      this.$refs.uploadImg.clickFile()
    },
    imgResult (v, name) {
      this.imgData = {
        url: v,
        name: name
      }
    },
    videoResult (v, name) {
      this.playData = {
        url: v,
        name
      }
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
      .group-item:hover {
        color: #2d8cf0;
      }
      .group-item:active {
        color: #157ceb;
      }
  }
  .right-content {
      flex: 1;
      margin-left: 10px;
      .right-content-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .group-title {
            font-weight: 800;
          }
          .right-action {
              display: flex;
              align-items: center;
          }
      }
  }
}
</style>
