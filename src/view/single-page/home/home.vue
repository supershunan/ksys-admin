<template>
    <div>
      <Row :gutter="20">
        <i-col :xs="12" :md="8" :lg="5" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
          <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
            <count-to :end="infor.count" count-class="count-style"/>
            <p>{{ infor.title }}</p>
          </infor-card>
        </i-col>
      </Row>
      <Row :gutter="20" style="margin-top: 10px;">
        <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
          <Card shadow>
            <chart-bar style="height: 300px;" :value="barData" text="访问量"/>
          </Card>
        </i-col>
        <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
          <Card shadow>
            <chart-bar style="height: 300px;" :value="barData" text="收益"/>
          </Card>
        </i-col>
      </Row>
      <Row :gutter="20" style="margin-top: 10px;">
        <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
          <Card shadow>
            <chart-bar style="height: 300px;" :value="barData" text="新增用户"/>
          </Card>
        </i-col>
        <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
          <Card shadow>
            <chart-bar style="height: 300px;" :value="barData" text="新增达人"/>
          </Card>
        </i-col>
      </Row>
    </div>
  </template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
import { getStatisticsData } from '@/api/home'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: [
        { title: '总访问量', icon: 'md-person-add', count: 803, color: '#2d8cf0' },
        { title: '总收益', icon: 'md-map', count: 14, color: '#9A66E4' },
        { title: '总用户', icon: 'md-locate', count: 232, color: '#19be6b' },
        { title: '总达人', icon: 'md-help-circle', count: 142, color: '#ff9900' }
      ],
      pieData: [
        { value: 335, name: '用户注册' },
        { value: 310, name: '达人入筑' },
        { value: 234, name: 'VIP订单' },
        { value: 135, name: '视频订单' },
        { value: 1548, name: '收益情况' }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      }
    }
  },
  mounted () {
    this.getStatistic()
  },
  methods: {
    async getStatistic () {
      const res = await getStatisticsData()
    }
  }
}
</script>

  <style lang="less">
  .count-style{
    font-size: 50px;
  }
  </style>
