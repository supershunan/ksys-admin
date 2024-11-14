<template>
  <div class="gold-store">
    <Card :bordered="true">
      <Row :gutter="rowGutter">
        <Form ref="searchForm" :model="searchForm" :rules="searchRules" inline>
          <FormItem prop="goodsName">
            <Input
              type="text"
              v-model="searchForm.goodsName"
              placeholder="商品名称"
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
              <Option
                v-for="item in statusList"
                :value="item.v"
                :key="item.v"
                >{{ item.k }}</Option
              >
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
      <Row :gutter="rowGutter">
        <Button type="primary" class="mg-btn" @click="addStore"><Icon type="md-add" size="16" />新增商品</Button>
      </Row>
      <Row :gutter="rowGutter" class="margin-top10">
          <Table border :columns="columns" :data="datas" :loading="isLoading"></Table>
      </Row>
      <Row :gutter="rowGutter" class="margin-top10">
          <Page :current="pageData.page" :page-size="pageData.rows" :total="pageData.total" @on-change="pageChange"
          :page-size-opts="pageOpts" @on-page-size-change="pageOptChange"
          show-sizer show-elevator show-total />
      </Row>
    </Card>
    <GoldStoreModal ref="goldStoreModalRef" @relaod="searchData"/>
  </div>
</template>
<script>
import { storeStatusMap } from '@/libs/dict'
import { getStoreListApi, delStoreApi } from '@/api/goldStore'
import GoldStoreModal from './components/GoldStoreModal.vue'
export default {
  components: {
    GoldStoreModal
  },
  data () {
    return {
      rowGutter: 10,
      selectStyle: { width: '189px' },
      searchForm: {},
      searchRules: {},
      statusList: [],
      columns: [
        {
          fixed: 'left',
          title: '商品名称',
          key: 'goodsName',
          tooltip: true
        },
        {
          title: '价格',
          key: 'price',
          tooltip: true
        },
        {
          title: '库存',
          key: 'store',
          tooltip: true
        },
        {
          title: '交易类型',
          key: 'changeType', // 1 现金 2 次元币 -1其他
          tooltip: true,
          render: (h, params) => {
            let d = params.row
            let v = d.changeType === 1 ? '现金' : d.changeType === 2 ? '次元币' : '其他'
            return h('Tag', { props: { color: 'green' } }, `${v}`)
          }
        },
        {
          title: '金额',
          key: 'money', // 1 现金 2 次元币 -1其他
          tooltip: true
        },
        {
          title: '操作',
          key: 'action',
          width: 240,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            let row = params.row
            return h('div', [
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.updateStore(row)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {

                },
                on: {
                  click: () => {
                    this.del(row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      datas: [],
      isLoading: false,
      pageOpts: [10, 20, 50, 100],
      pageData: {
        page: 1,
        rows: 10,
        total: 0
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.initDictData()
      this.getList()
    },
    async getList () {
      try {
        const res = await getStoreListApi({
          ...this.pageData,
          ...this.searchForm
        })
        this.datas = res.rows
        this.pageData.total = res.total
      } catch (error) {
        console.log(error)
      }
    },
    initDictData () {
      let statusList = []
      for (let k in storeStatusMap) {
        statusList.push({ k: storeStatusMap[k].v, v: k })
      }
      this.statusList = statusList
    },
    searchData () {
      this.pageData.page = 1
      this.pageData.total = 0
      this.getList()
    },
    resetData () {
      this.searchForm = {}
      this.searchData()
    },
    pageChange (page) {
      this.pageData.page = page
      this.getList()
    },
    pageOptChange (rows) {
      this.pageData.rows = rows
      this.getList()
    },
    addStore () {
      this.$refs.goldStoreModalRef.open('add')
    },
    updateStore (row) {
      this.$refs.goldStoreModalRef.open('update', row)
    },
    del (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除该商品吗？',
        onOk: () => {
          delStoreApi({ ids: row.id }).then(res => {
            this.$Message.success('删除成功')
            this.searchData()
          })
        }
      })
    }
  }
}
</script>
