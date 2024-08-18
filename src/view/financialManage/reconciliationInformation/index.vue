<template>
    <div>
        <Card>
            <template #title>
                <span class="notice_title">对账信息</span>
            </template>
            <Table :columns="columns" :data="data"></Table>
        </Card>
    </div>
</template>

<script>
import { getReconciliationApi } from '@/api/financialManage'
export default {
  data () {
    return {
      columns: [
        {
          title: '总收益（元）',
          align: 'center',
          key: 'totalIncomeMoney'
        },
        {
          title: '—',
          align: 'center',
          key: '#'
        },
        {
          title: '提现支出（元）',
          align: 'center',
          key: 'cashTotalMoney'
        },
        {
          title: '=',
          align: 'center',
          key: '#'
        },
        {
          title: '实际收益（元）',
          align: 'center',
          key: 'realIncomeMoney'
        }
      ],
      data: []
    }
  },
  mounted () {
    this.getReconciliation()
  },
  methods: {
    getReconciliation () {
      getReconciliationApi().then(res => {
        if (res.data) {
          this.data = [res.data]
        }
      })
    }
  }
}
</script>

<style scoped>
.notice_title {
    font-size: 20px;
    font-weight: bolder;
}
</style>
