<template>
    <div style="height: 100%;">
        <Tabs :value="currentTabName" @on-click="handleTabs">
            <TabPane label="图片" name="图片">
              <TabContent :currentTabName="currentTabName" />
            </TabPane>
            <TabPane label="视频" name="视频">
              <TabContent :currentTabName="currentTabName" />
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import TabContent from './tabContent.vue'
import axios from 'axios'
export default {
  components: {
    TabContent
  },
  data () {
    return {
      currentTabName: '图片',
      selectedFile: ''
    }
  },
  methods: {
    handleTabs (name) {
      console.log(name)
    }
  }
}
</script>
