<style lang="less">
  @import './reg.less';
</style>
<style lang="less" scoped>

</style>

<template>
  <div class="reg">
    <div class="reg-module">
        <div class="title el-center-list">
            欢迎入驻次元世界
        </div>
        <div class="form-module">
            <Divider orientation="left">填写您的信息吧</Divider>
            <Form :model="dataForm" :label-width="80">
                <FormItem label="账号" :required="true">
                    <Input v-model="dataForm.account" placeholder="填写您的账号"></Input>
                </FormItem>
                <FormItem label="昵称" :required="true">
                    <Input v-model="dataForm.nickname" placeholder="填写您的昵称"></Input>
                </FormItem>
                <FormItem label="密码" :required="true">
                    <Input type="password" v-model="dataForm.pwd" placeholder="填写您的密码"></Input>
                </FormItem>
                <FormItem label="电话" :required="true">
                    <Input type="phone" v-model="dataForm.phone" placeholder="填写您的电话"></Input>
                </FormItem>
                <FormItem label="个人简介" :required="true">
                    <Input v-model="dataForm.info" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="填写您的个人简介"></Input>
                </FormItem>
            </Form>
            <Button class="reg-btn" type="warning" @click="regSubmit">注册</Button>
        </div>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5'
import { checkFieldReqs } from '@/libs/util.js'
import { regExpert } from '@/api/user.js'
export default {
  components: {

  },
  data:() => {
    return {
        code: null,
        dataForm: {},
    }
  },
  mounted() {
    try {
        let code = this.$router.history.current.query.code
        if (code == null || code.length == 0) {
            this.$Message.error("入驻入口链接不正确")
            this.toLogin()
        }
        this.code = code
    }catch(e) {
        this.$Message.error("入驻入口链接不正确")
        this.toLogin()
    }
  },
  methods: {
    toLogin() {
        this.$router.push({
          name: 'login'
        })
    },
    regSubmit() {
        let d = this.dataForm
        let fs = [ {f:'account',m:'账号'},{f:'nickname',m:'昵称'},{f:'pwd',m:'密码'},{f:'phone',m:'电话'},{f:'info',m:'个人简介'} ]
        if (!checkFieldReqs(d,fs)) {
            return
        }
        if (d.account.length < 6) {
            this.$Message.warning('账号长度不得小于6位')
            return
        }
        if (d.nickname.length < 3) {
            this.$Message.warning('昵称长度不得小于3位')
            return
        }
        if (d.pwd.length < 3) {
            this.$Message.warning('密码长度不得小于6位')
            return
        }
        if (d.phone.length != 11) {
            this.$Message.warning('电话格式不正确')
            return
        }
        d.password = md5(d.pwd)
        d.shareUrl = this.code
        let _that = this
        regExpert(d).then(res => {
            this.$Message.error("入驻申请提交成功，请耐心等待管理员审批~")
            setTimeout(() => {
                _that.toLogin()
            }, 2000);
        })
    },
  }
}
</script>
