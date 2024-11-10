<template>
  <div class="gold-store">
    <Card :bordered="true">
      <Row :gutter="rowGutter">
        <Form ref="searchForm" :model="searchForm" :rules="searchRules" inline>
          <FormItem prop="account">
            <Input
              type="text"
              v-model="searchForm.account"
              placeholder="用户账号"
            >
              <Icon type="ios-color-filter" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="nickname">
            <Input
              type="text"
              v-model="searchForm.nickname"
              placeholder="用户昵称"
            >
              <Icon type="ios-color-filter" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="phone">
            <Input
              type="text"
              v-model="searchForm.phone"
              placeholder="用户电话"
            >
              <Icon type="ios-color-filter" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="status">
            <Select
              v-model="searchForm.status"
              :style="selectStyle"
              placeholder="状态"
            >
              <Option v-for="(item, i) in statusList" :value="item.v">{{
                item.k
              }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" class="mg-btn" @click="searchData"
              >查询</Button
            >
            <Button class="mg-btn" @click="resetData">重置</Button>
          </FormItem>
        </Form>
      </Row>
    </Card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rowGutter: 10,
      selectStyle: { width: '189px' },
      searchForm: {}
    }
  },
  mounted () {},
  methods: {}
}
</script>
