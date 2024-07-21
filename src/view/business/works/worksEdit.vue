<style lang="less" scoped>

</style>
<template>
    <Modal class="works-edit" v-model="modalShow" :title="modalTitle" width="700" :styles="{ top:'20px' }">
        <Form ref="dataForm" :model="dataForm" :label-width="labelWidth" :rules="dataRules">
            <Divider orientation="left">{{ infoTitle }}</Divider>
            <Row :gutter="rowGutter" v-if="dataType == 'video'">
                <Col span="8">
                    <div class="works-avatar el-center-list">
                        <img @click="openImg('bgImg')" :src="dataForm.bgImg?dataForm.bgImg:imgIcon" />
                        <Button style="margin-top: 5px;" type="primary" size="small" @click="imgClick('bgImg')"><Icon type="md-cloud-upload" /> 上传宣传背景图</Button>
                    </div>
                </Col>
                <Col span="16">
                    <FormItem prop="pid" label="选择合集">
                        <Select v-model="dataForm.pid" placeholder="选择合集">
                            <Option v-for="d,i in folderList" :value="d.id">{{ d.title }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="title" label="视频名称">
                        <Input type="text" v-model="dataForm.title" placeholder="请输入"></Input>
                    </FormItem>
                    <FormItem prop="sort" label="排序">
                        <Input type="number" v-model="dataForm.sort" placeholder="请输入"></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="rowGutter" v-else>
                <Col span="8">
                    <div class="works-avatar el-center-list">
                        <img @click="openImg('coverImg')" :src="dataForm.coverImg?dataForm.coverImg:imgIcon" />
                        <Button style="margin-top: 5px;" type="primary" size="small" @click="imgClick('coverImg')"><Icon type="md-cloud-upload" /> 上传合集封面图</Button>
                    </div>
                </Col>
                <Col span="16">
                    <FormItem prop="title" label="合集名称">
                        <Input type="text" v-model="dataForm.title" placeholder="请输入"></Input>
                    </FormItem>
                    <FormItem prop="sort" label="排序">
                        <Input type="number" v-model="dataForm.sort" placeholder="请输入"></Input>
                    </FormItem>
                </Col>
            </Row>
            <FormItem prop="cLabelList" label="选择分类" v-if="dataType == 'video'">
                <Select v-model="cLabelList" multiple placeholder="选择分类">
                    <Option v-for="v,i in labelList" :value="v.id">{{ v.name }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="useTime" label="使用时间" v-if="dataType == 'video'">
                <Input type="number" v-model="dataForm.useTime" placeholder="请输入（小时）"></Input>
            </FormItem>
            <FormItem prop="money" label="价格" v-if="dataType == 'video'">
                <Input type="number" v-model="dataForm.money" placeholder="请输入"></Input>
            </FormItem>
            <FormItem prop="collNum" label="集数" v-if="dataType == 'video'">
                <Input type="number" v-model="dataForm.collNum" placeholder="请输入"></Input>
            </FormItem>
            <FormItem prop="info" label="视频简介" v-if="dataType == 'video'">
                <Input v-model="dataForm.info" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="视频简介"></Input>
            </FormItem>
            <Divider orientation="left" v-if="dataType == 'video'">视频上传</Divider>
            <Row :gutter="rowGutter" v-if="dataType == 'video'">
                <Col span="8">
                    <div class="works-bg el-center-list">
                        <img @click="openImg('coverImg')" :src="dataForm.coverImg?dataForm.coverImg:imgIcon" />
                        <Button style="margin-top: 5px;" type="primary" size="small" @click="imgClick('coverImg')"><Icon type="md-cloud-upload" /> 上传封面图</Button>
                    </div>
                </Col>
                <Col span="16">
                    <div class="works-video el-center-list">
                        <uploadFile ref="uploadVideo" :size="500 * 1024" item="ksys" module="works" type="videoSing" 
                        @fileResult="videoResult" @videoTimeResult="videoTimeResult" @filePro="videoProResult"></uploadFile>
                        <Progress v-if="videoPerShow" style="margin-top: 10px;" :percent="videoPer" :stroke-color="['#108ee9', '#87d068']" ></Progress>
                    </div>
                </Col>
            </Row>
        </Form>
        <uploadFile style="display: none;" ref="uploadImg" :size="5 * 1024" item="ksys" module="works" type="imgSing" @fileResult="imgResult" ></uploadFile>
        <mediaSee ref="mediaSee"></mediaSee>
        <div slot="footer">
            <Button size="large" @click="moduleClose">取消</Button>
            <Button type="primary" size="large" :loading="modalLoading" @click="submit" v-if="modalType != 'info'">提交</Button>
        </div>
    </Modal>
</template>
<script>
import imgIcon from "@/assets/images/icon/img.png"
import { addVideoData,addFolderData,infoData,updateData,listFolderApi } from "@/api/works"
import { videoListData } from "@/api/label"
import { checkTxt,checkTxtDef,timeFmt,checkFieldTipReqs } from "@/libs/util"
import uploadFile from "_c/upload/uploadFile.vue"
export default {
  name: '',
  components: {
    uploadFile
  },
  props: {
    
  },
  data() {
    return {
        checkTxt,checkTxtDef,timeFmt,imgIcon,
        modalShow: false,
        modalType: 'add',
        modalLoading: false,
        modalTitle: "发布视频",
        infoTitle: '',
        rowGutter: 10,
        labelWidth: 80,
        dataForm: {},
        dataRules: {
            
        },
        dataType: 'video',
        nowField: '',
        videoPer: 0,
        videoPerShow: false,
        folderList: [],
        labelList: [],
        cLabelList: [],
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
      this.getLabels()
      this.getFolders()
    },
    getLabels() {
        let _that = this
        videoListData().then(res => {
            if (res.data) {
                _that.labelList = res.data
            }
        })
    },
    getFolders() {
        let _that = this
        listFolderApi().then(res => {
            if (res.data) {
                _that.folderList = res.data
            }
        })
    },
    open(dt,type,id,pid) {
        if (dt == 'folder') {
            this.modalTitle = '创建合集'
            this.infoTitle = '合集信息'
        } else {
            this.modalTitle = '发布视频'
            this.infoTitle = '视频信息'
        }
        if (this.$refs.uploadVideo) {
            this.$refs.uploadVideo.resetData()
        }
        this.cLabelList = []
        this.modalLoading = false
        this.modalShow = true
        this.dataType = dt
        this.dataForm = { pid:pid }
        if (type == null || type == 'add') {
            this.modalType = 'add'
        } else {
            this.modalType = type
            this.getInfo(id)
        }
    },
    getInfo(id) {
        let _that = this
        _that.modalLoading = true
        infoData(id).then(res => {
            _that.modalLoading = false
            _that.dataForm = res.data
            _that.dataForm.status = _that.dataForm.status+''
            _that.dataForm.pid = parseInt(_that.dataForm.pid)
            if (checkTxt(_that.dataForm.playUrl) && this.$refs.uploadVideo) {
                _that.$refs.uploadVideo.setVal(_that.dataForm.playUrl)
            }
            let ldList = _that.dataForm.labelDataList
            if (ldList && ldList.length > 0) {
                let nList = []
                for (let i = 0; i < ldList.length; i++) {
                    const iObj = ldList[i];
                    nList.push(iObj.id)
                }
                _that.cLabelList = nList
            }
        })
    },
    moduleClose() {
        this.modalShow = false
    },
    imgClick(field) {
        this.nowField = field
        this.$refs.uploadImg.clickFile()
    },
    videoResult(v) {
        this.dataForm.playUrl = v
    },
    videoTimeResult(v) {
        if (v != null) {
            this.dataForm.playTime = v
        }
    },
    videoProResult(v) {
        v = parseFloat(v)
        this.videoPer = v
        if (v < 100) {
            this.videoPerShow = true
        } else {
            this.videoPerShow = false
        }
    },
    imgResult(v) {
        let field = this.nowField
        let d = {...this.dataForm}
        d[field] = v
        this.dataForm = d
    },
    openImg(field) {
        let url = this.dataForm[field]
        if (!url) {
            this.$Message.warning('未上传')
            return
        }
        this.$refs.mediaSee.open(url)
    },
    submit() {
        let _that = this
        this.$refs['dataForm'].validate((valid) => {
            if (valid) {
                let d = _that.dataForm
                if (this.cLabelList && this.cLabelList.length > 0) {
                    d.labelList = [...this.cLabelList]
                }
                if (_that.modalType == "add") {
                    if (_that.dataType == 'video') {
                        let fs = [ {f:"title",m:"视频名称"},{f:"useTime",m:"购买后的使用时间"},{f:"money",m:"价格"}
                        ,{f:"coverImg",m:"封面图",t:"未上传"},{f:"playUrl",m:"视频",t:"未上传"} ]
                        if (!checkFieldTipReqs(d,fs)) {
                            return
                        }
                        _that.modalLoading = true
                        addVideoData(d).then(res => {
                            _that.modalLoading = false
                            _that.$Message.success("发布成功，请耐心等待审核")
                            _that.$emit('lastLoad')
                            _that.moduleClose()
                        })
                    } else {
                        let fs = [ {f:"title",m:"合集名称"},{f:"collNum",m:"集数"} ]
                        if (!checkFieldTipReqs(d,fs)) {
                            return
                        }
                        _that.modalLoading = true
                        addFolderData(d).then(res => {
                            _that.modalLoading = false
                            _that.$Message.success("创建合集成功")
                            _that.$emit('lastLoad')
                            _that.moduleClose()
                        })
                    }
                } else {
                    if (_that.dataType == 'video') {
                        let fs = [ {f:"title",m:"视频名称"},{f:"useTime",m:"购买后的使用时间"},{f:"money",m:"价格"}
                        ,{f:"coverImg",m:"封面图",t:"未上传"},{f:"playUrl",m:"视频",t:"未上传"} ]
                        if (!checkFieldTipReqs(d,fs)) {
                            return
                        }
                    } else {
                        let fs = [ {f:"title",m:"合集名称"},{f:"collNum",m:"集数"} ]
                        if (!checkFieldTipReqs(d,fs)) {
                            return
                        }
                    }
                    _that.modalLoading = true
                    updateData(d).then(res => {
                        _that.modalLoading = false
                        _that.$Message.success("修改成功")
                        _that.$emit('lastLoad')
                        _that.moduleClose()
                    })
                }
            } else {
                this.$Message.error('请填写必要信息');
            }
        })
    },
  },
};
</script>