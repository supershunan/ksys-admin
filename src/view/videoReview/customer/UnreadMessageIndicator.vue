<template>
  <div class="unread-indicator" v-if="count > 0">
    <Badge :count="count" />
    <span>未读消息</span>
  </div>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
.unread-indicator {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #fff;
  padding: 5px 10px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  z-index: 1000;
}

.unread-indicator span {
  margin-left: 5px;
  font-size: 14px;
}
</style>

