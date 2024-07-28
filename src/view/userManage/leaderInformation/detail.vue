<style lang="less" scoped>

</style>
<template>
    <Modal class="user-detail" v-model="modalShow" :title="modalTitle">
        <Form ref="dataForm" :model="dataForm" :label-width="labelWidth" :rules="dataRules">
            <Row :gutter="rowGutter">
                <Col span="8">
                    <div class="user-avatar el-center-list">
                        <img @click="openImg('avatar')" :src="dataForm.avatar?dataForm.avatar:imgIcon" />
                        <Button style="margin-top: 5px;" type="primary" size="small" @click="imgClick('avatar')"><Icon type="md-cloud-upload" /> 上传头像</Button>
                    </div>
                </Col>
                <Col span="16">
                    <FormItem prop="account" label="账号">
                        <Input type="text" v-model="dataForm.account" placeholder="请输入"></Input>
                    </FormItem>
                    <FormItem prop="nickname" label="昵称">
                        <Input type="text" v-model="dataForm.nickname" placeholder="请输入"></Input>
                    </FormItem>
                    <FormItem prop="sex" label="性别">
                        <Select v-model="dataForm.sex">
                            <Option v-for="item,i in sexList" :value="item.v">{{ item.k }}</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <FormItem prop="phone" label="电话">
                <Input type="text" v-model="dataForm.phone" placeholder="请输入"></Input>
            </FormItem>
            <FormItem prop="info" label="个人介绍">
                <Input v-model="dataForm.info" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="个人简介"></Input>
            </FormItem>
            <FormItem prop="address" label="常驻地址">
                <Input type="text" v-model="dataForm.address" placeholder="请输入"></Input>
            </FormItem>
            <FormItem prop="status" label="状态">
                <Select v-model="dataForm.status">
                    <Option v-for="item,i in statusList" :value="item.v">{{ item.k }}</Option>
                </Select>
            </FormItem>
        </Form>
        <uploadFile style="display: none;" ref="uploadImg" :size="5 * 1024" item="ksys" module="user" type="imgSing" @fileResult="imgResult" ></uploadFile>
        <mediaSee ref="mediaSee"></mediaSee>
        <div slot="footer">
            <Button size="large" @click="moduleClose">取消</Button>
            <Button type="primary" size="large" :loading="modalLoading" @click="submit" v-if="modalType != 'info'">提交</Button>
        </div>
    </Modal>
</template>
<script>
import imgIcon from "@/assets/images/icon/img.png"
import { addUserData,infoData,updateData } from "@/api/user"
import { checkTxt,checkTxtDef,timeFmt } from "@/libs/util"
import { userSexMap,userStatusMap } from "@/libs/dict"
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
        checkTxt,
        checkTxtDef,
        timeFmt,
        userSexMap,
        userStatusMap,
        modalShow: false,
        modalType: 'add',
        modalLoading: false,
        modalTitle: "添加",
        rowGutter: 10,
        labelWidth: 80,
        dataForm: {},
        dataRules: {
            account: [
                { required: true, message: '请填写账号', trigger: 'blur' }
            ],
            nickname: [
                { required: true, message: '请填写昵称', trigger: 'blur' }
            ],
            status: [
                { required: true, message: '请选择状态', trigger: 'blur' }
            ],
        },
        sexList: [],
        statusList: [],
        nowField: '',
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
      this.initDictData()
    },
    open(type,id) {
        this.modalShow = true
        this.dataForm = {}
        if (type == null) {
            this.modalTitle = '添加用户'
            this.modalType = 'add'
        } else {
            this.modalTitle = '编辑用户信息'
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
            if (_that.dataForm.sex) {
                _that.dataForm.sex = _that.dataForm.sex+''
            }
            _that.dataForm.status = _that.dataForm.status+''
        })
    },
    initDictData() {
        let sexList = []
        for (let k in userSexMap) {
            sexList.push({ k: userSexMap[k],v: k })
        }
        this.sexList = sexList
        let statusList = []
        for (let k in userStatusMap) {
            statusList.push({ k: userStatusMap[k].v,v: k })
        }
        this.statusList = statusList
    },
    moduleClose() {
        this.modalShow = false
    },
    imgClick(field) {
        this.nowField = field
        this.$refs.uploadImg.clickFile()
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
                _that.modalLoading = true
                let d = _that.dataForm
                if (_that.modalType == "add") {
                    addUserData(d).then(res => {
                        _that.modalLoading = false
                        _that.$Message.success("添加成功")
                        _that.$emit('lastLoad')
                        _that.moduleClose()
                    })
                } else {
                    updateData(d).then(res => {
                        _that.modalLoading = false
                        _that.$Message.success("修改成功")
                        _that.$emit('lastLoad')
                        _that.getInfo(d.id)
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