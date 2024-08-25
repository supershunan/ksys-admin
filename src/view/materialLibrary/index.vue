<template>
    <div style="height: 100%;">
      <Card>
        <p slot="title">
           素材管理
        </p>
        <a href="#" slot="extra">
            <Button type="warning" size="small" @click="onChange">{{isMaterialLibrary ? '回收站' : '素材库'}}</Button>
        </a>
        <Tabs :value="currentTabName" @on-click="handleTabs">
        <TabPane label="图片" name="pic">
          </TabPane>
          <TabPane label="视频" name="video">
          </TabPane>
        </Tabs>
        <TabContent :currentTabName="currentTabName" :isMaterialLibrary="isMaterialLibrary" />
      </Card>
    </div>
</template>

<script>
import TabContent from './tabContent.vue'
export default {
  components: {
    TabContent
  },
  data () {
    return {
      currentTabName: 'pic',
      isMaterialLibrary: true
    }
  },
  mounted () {
  },
  methods: {
    handleTabs (name) {
      this.currentTabName = name
    },
    onChange () {
      this.isMaterialLibrary = !this.isMaterialLibrary
    }
  }
}
</script>

<style scoped>

</style>
