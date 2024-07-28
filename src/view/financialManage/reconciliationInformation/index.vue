<template>
    <div>
        <Card>
            <template #title>
                <span class="notice_title">对账信息</span>
            </template>
            <Table :columns="columns1" :data="data1"></Table>
        </Card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      columns1: [
        {
          title: '总收益（元）',
          align: 'center',
          key: 'allMoney'
        },
        {
          title: '—',
          align: 'center',
          key: '#'
        },
        {
          title: '提现支出（元）',
          align: 'center',
          key: 'withdrawalMoney'
        },
        {
          title: '=',
          align: 'center',
          key: '#'
        },
        {
          title: '实际收益（元）',
          align: 'center',
          key: 'realityMoney'
        }
      ],
      data1: [
        {
          allMoney: 100,
          age: '',
          withdrawalMoney: 20,
          realityMoney: 80
        }
      ]
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
