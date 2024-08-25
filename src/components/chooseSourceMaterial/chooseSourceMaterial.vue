<template>
  <div>
    <div class="top">
      <Button type="primary" size="small" @click="back">返回</Button>
      <Select v-model="currentType" style="width:100px; margin: 0 20px;">
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Select v-model="currentFold" style="width:100px">
          <Option v-for="item in foldList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
    </div>
    <Table border ref="selection" :columns="sourceColumn" :data="sourceData" style="margin: 10px 0;">
      <template slot-scope="{ row, index }" slot="action">
          <Button type="success" size="small" @click="chooseSource(row)">选择</Button>
      </template>
    </Table>
    <Page size="small" :total="feadbackTotal" :page-size="5" show-sizer @on-change="feadbackPageCange" @on-page-size-change="feadbackPageSizeChange" :page-size-opts="[5, 10, 20, 40]" />
  </div>
</template>
<script>
import { getClassifyListApi } from '@/api/materialLibrary'
export default {
  data () {
    return {
      typeList: [
        {
          value: 'pic',
          label: '图片'
        },
        {
          value: 'video',
          label: '视频'
        }
      ],
      foldList: [],
      currentType: '',
      currentFold: '',
      params: {
        page: 1,
        rows: 10
      },
      total: 0,
      sourceColumn: [
        {
          title: '名称',
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
                  this.currentType === 'pic' ? 'img' : 'video',
                  {
                    attrs: { src: url, controls: this.currentType === 'video' },
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
          align: 'center'
        }
      ],
      sourceData: []
    }
  },
  watch: {
    currentType: {
      handler: function (oldValue, newValue) {
        this.getClassifyList()
      }
    },
    currentFold: {
      handler: function (oldValue, newValue) {
        console.log('wkkk', this.currentFold)
        this.params = {
          page: 1,
          rows: 10
        }
        this.getClassifySourceList()
      }
    }
  },
  methods: {
    getClassifyList () {
      getClassifyListApi({
        type: 'folder',
        category: this.currentType === 'pic' ? 1 : 2
      }).then(res => {
        if (res.rows.length > 0) {
          this.foldList = res.rows
        } else {
          this.foldList = []
        }
      })
    },
    getClassifySourceList () {
      getClassifyListApi({
        state: 1,
        pid: this.currentFold,
        type: this.currentType,
        ...this.params
      }).then(res => {
        this.sourceData = res.rows
        this.total = res.total
      })
    },
    back () {
      this.$emit('goBack')
    },
    chooseSource (item) {
      this.$Modal.confirm({
        title: '是否选择该资源？',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          this.$Message.info('选择')
          this.$emit('chooseSource', item)
          this.$emit('goBack')
        },
        onCancel: () => {
          this.$Message.info('取消')
        }
      })
    },
    feadbackPageCange (index) {
      this.params.page = index
      this.getClassifySourceList()
    },
    feadbackPageSizeChange (index) {
      this.params.rows = index
      this.getClassifySourceList()
    }
  }
}
</script>
