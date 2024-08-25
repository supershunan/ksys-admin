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
            <chart-bar style="height: 300px;" :value="barData.oneWeekVisitCount" text="访问量"/>
          </Card>
        </i-col>
        <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
          <Card shadow>
            <chart-bar style="height: 300px;" :value="barData.oneWeekMoney" text="收益"/>
          </Card>
        </i-col>
      </Row>
      <Row :gutter="20" style="margin-top: 10px;">
        <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
          <Card shadow>
            <chart-bar style="height: 300px;" :value="barData.newUserCount" text="新增用户"/>
          </Card>
        </i-col>
        <i-col :md="24" :lg="12" style="margin-bottom: 20px;">
          <Card shadow>
            <chart-bar style="height: 300px;" :value="barData.newExpertCount" text="新增达人"/>
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
        { title: '总访问量', icon: 'md-person-add', count: 803, color: '#2d8cf0', key: 'visitCount' },
        { title: '总收益', icon: 'md-map', count: 14, color: '#9A66E4', key: 'totalMoney' },
        { title: '总用户', icon: 'md-locate', count: 232, color: '#19be6b', key: 'totalUserCount' },
        { title: '总达人', icon: 'md-help-circle', count: 142, color: '#ff9900', key: 'totalExpertCount' }
      ],
      barData: {
        oneWeekVisitCount: {},
        oneWeekMoney: {},
        newUserCount: {},
        newExpertCount: {}
      }
    }
  },
  mounted () {
    this.getStatistic()
  },
  methods: {
    async getStatistic () {
      const res = await getStatisticsData()
      if (Object.keys(res.data).length > 0) {
        this.inforCardData.forEach(item => {
          item.count = res.data[item.key]
        })

        Object.keys(this.barData).forEach(item => {
          this.barData[item] = res.data[item]
        })
      }
    }
  }
}
</script>

  <style lang="less">
  .count-style{
    font-size: 50px;
  }
  </style>
