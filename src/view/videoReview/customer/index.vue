<template>
  <div class="chat-container">
    <UnreadMessageIndicator :count="totalUnreadCount" />
    <Row type="flex" class="h-full">
      <Col span="6" class="user-list">
        <List>
          <ListItem
            v-for="user in uniqueUsers"
            :key="user.fromUserId"
            @click.native="selectUser(user)"
          >
            <ListItemMeta
              :avatar="user.fromAvatar"
              :title="`用户 ${user.fromUserId}`"
            />
            <Badge
              v-if="getUnreadCount(user.fromUserId) > 0"
              :count="getUnreadCount(user.fromUserId)"
            />
          </ListItem>
        </List>
      </Col>
      <Col span="18" class="chat-area">
        <div v-if="selectedUser" class="chat-window">
          <Card
            :title="
              selectedUser.fromUserId === currentUserInfo.id
                ? '我的消息'
                : `用户 ${selectedUser.fromUserId}`
            "
          >
            <a href="#" slot="extra" @click.prevent="changeLimit">
              <Dropdown placement="bottom-end" @on-click="dropdownClick">
                <a href="javascript:void(0)">
                  设置
                  <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="checkHistoryChat">
                    查看聊天记录
                  </DropdownItem>
                  <DropdownItem name="clearHistoryChat">
                    清除聊天记录
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </a>
            <div class="message-area" ref="messageArea">
              <div
                v-for="message in filteredMessages"
                :key="message.id"
                class="message-wrapper"
                :class="{
                  'message-right': message.fromUserId === currentUserInfo.id,
                }"
              >
                <div class="message-content">
                  <Avatar
                    :src="message.fromAvatar"
                    size="small"
                    class="message-avatar"
                  />
                  <div class="message-bubble">
                    {{ message.message }}
                  </div>
                </div>
                <div class="message-time">
                  {{ formatTime(message.createTime) }}
                </div>
              </div>
            </div>
            <div class="input-area">
              <Input
                v-model="newMessage"
                placeholder="输入消息..."
                @on-enter="sendMessage"
                type="textarea"
                :rows="3"
              >
              </Input>
              <Button
                type="primary"
                icon="ios-send"
                @click="sendMessage"
                class="send-button"
                :loading="sending"
              >
                发送
              </Button>
            </div>
          </Card>
        </div>
        <div v-else class="no-chat-selected">
          <Icon type="ios-chatbubbles" size="48" />
          <h3>请选择一个联系人开始聊天</h3>
        </div>
      </Col>
    </Row>
    <Modal
      v-model="chatVisbility"
      title="查看聊天记录"
      @on-ok="closeHistoryChat"
      @on-cancel="closeHistoryChat"
    >
      <Scroll :on-reach-bottom="handleReachBottom" height="300">
        <Card
          dis-hover
          v-for="(item, index) in historyChatList"
          :key="index"
          style="margin: 32px 0"
        >
          <div style="display: flex; justify-content: space-between">
            <span style="font-weight: 600">{{ item.message }}</span>
            <span>{{ item.createTime }}</span>
          </div>
        </Card>
      </Scroll>
    </Modal>
  </div>
</template>

<script>
import UnreadMessageIndicator from './UnreadMessageIndicator.vue'
import { historyChatApi } from '@/api/videoReview'

class MessageDB {
  constructor () {
    this.initDB()
  }

  async initDB () {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ChatDB', 2)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        if (!db.objectStoreNames.contains('messages')) {
          const store = db.createObjectStore('messages', { keyPath: 'id' })
          store.createIndex('fromUserId', 'fromUserId')
          store.createIndex('toUserId', 'toUserId')
          store.createIndex('createTime', 'createTime')
          store.createIndex('isRead', 'isRead')
        }
      }
    })
  }

  async addMessage (message) {
    await this.initDB()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['messages'], 'readwrite')
      const store = transaction.objectStore('messages')
      const request = store.put(message)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getAllMessages () {
    await this.initDB()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['messages'], 'readonly')
      const store = transaction.objectStore('messages')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async updateMessageReadStatus (fromUserId, toUserId) {
    await this.initDB()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['messages'], 'readwrite')
      const store = transaction.objectStore('messages')
      const request = store.openCursor()

      request.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          const message = cursor.value
          if (
            message.fromUserId === fromUserId &&
            message.toUserId === toUserId
          ) {
            message.isRead = true
            cursor.update(message)
          }
          cursor.continue()
        } else {
          resolve()
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  async clearUserMessages (userId) {
    await this.initDB()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['messages'], 'readwrite')
      const store = transaction.objectStore('messages')
      const request = store.openCursor()

      request.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          const message = cursor.value
          if (
            message.fromUserId === userId ||
            message.toUserId === userId
          ) {
            cursor.delete()
          }
          cursor.continue()
        } else {
          resolve()
        }
      }
      request.onerror = () => reject(request.error)
    })
  }
}

export default {
  components: {
    UnreadMessageIndicator
  },
  data () {
    return {
      messages: [],
      selectedUser: null,
      newMessage: '',
      currentUserInfo: JSON.parse(window.localStorage.getItem('userInfo')),
      sending: false,
      messageDB: null,
      totalUnreadCount: 0,
      unreadCounts: {},
      historyChatList: [],
      params: {
        page: 1,
        rows: 10
      },
      chatVisbility: false
    }
  },

  computed: {
    uniqueUsers () {
      const users = new Map()
      this.messages.forEach((msg) => {
        // 如果消息发送者是当前用户，则添加接收者信息
        if (msg.fromUserId === this.currentUserInfo.id) {
          if (!users.has(msg.toUserId)) {
            users.set(msg.toUserId, {
              fromUserId: msg.toUserId,
              fromAvatar: msg.toAvatar // 如果有接收者头像的话
            })
          }
        }
        // 如果消息接收者是当前用户，则添加发送者信息
        else if (msg.toUserId === this.currentUserInfo.id) {
          if (!users.has(msg.fromUserId)) {
            users.set(msg.fromUserId, {
              fromUserId: msg.fromUserId,
              fromAvatar: msg.fromAvatar
            })
          }
        }
      })
      return Array.from(users.values())
    },

    filteredMessages () {
      if (!this.selectedUser) return []
      return this.messages.filter(
        (msg) =>
          msg.fromUserId === this.selectedUser.fromUserId ||
          msg.toUserId === this.selectedUser.fromUserId
      )
    },

    ws () {
      return this.$store.getters.getWebSocket
    }
  },

  methods: {
    async handleNewMessage (message) {
      message.isRead = false
      await this.messageDB.addMessage(message)
      this.messages.push(message)
      if (
        message.toUserId === this.currentUserInfo.id &&
        (!this.selectedUser ||
          message.fromUserId !== this.selectedUser.fromUserId)
      ) {
        this.unreadCounts[message.fromUserId] =
          (this.unreadCounts[message.fromUserId] || 0) + 1
      }
      this.$nextTick(() => {
        this.scrollToBottom()
      })
      this.updateUnreadCount()
      this.getUnreadCount(message.fromUserId);
    },

    async selectUser (user) {
      this.selectedUser = user
      await this.messageDB.updateMessageReadStatus(
        user.fromUserId,
        this.currentUserInfo.id
      )
      this.messages = this.messages.map((msg) => {
        if (
          msg.fromUserId === user.fromUserId &&
          msg.toUserId === this.currentUserInfo.id
        ) {
          return { ...msg, isRead: true }
        }
        return msg
      })
      this.unreadCounts[user.fromUserId] = 0
      this.updateUnreadCount()
    },

    getUnreadCount (userId) {
      return this.unreadCounts[userId] || 0
    },

    async sendMessage () {
      if (!this.newMessage.trim() || !this.selectedUser || !this.ws) return

      this.sending = true
      try {
        const message = {
          createTime: new Date().toISOString(),
          fromUserId: this.currentUserInfo.id,
          fromAvatar: this.currentUserInfo.avatar,
          toUserId: this.selectedUser.fromUserId,
          message: this.newMessage,
          status: 1,
          id: Date.now(),
          token: window.localStorage.getItem('token')
        }

        this.ws.send(JSON.stringify(message))
        await this.handleNewMessage(message)
        this.newMessage = ''
      } catch (error) {
        this.$Message.error('发送失败，请重试')
      } finally {
        this.sending = false
      }
    },

    scrollToBottom () {
      const messageArea = this.$refs.messageArea
      if (messageArea) {
        messageArea.scrollTop = messageArea.scrollHeight
      }
    },

    formatTime (time) {
      if (!time) return ''
      const date = new Date(time)
      return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
    },

    async loadHistoryMessages () {
      try {
        const messages = await this.messageDB.getAllMessages()
        this.messages = messages.sort(
          (a, b) => new Date(a.createTime) - new Date(b.createTime)
        )
        this.messages.forEach((msg) => {
          if (msg.toUserId === this.currentUserInfo.id && !msg.isRead) {
            this.unreadCounts[msg.fromUserId] =
              (this.unreadCounts[msg.fromUserId] || 0) + 1
          }
        })
        this.updateUnreadCount()
      } catch (error) {
        console.error('加载历史消息失败:', error)
      }
    },

    updateUnreadCount () {
      this.totalUnreadCount = Object.values(this.unreadCounts).reduce(
        (sum, count) => sum + count,
        0
      )
    },

    async getHistoryChat (params) {
      await historyChatApi({
        ...params,
        fromUserId: this.selectedUser.fromUserId,
        toUserId: this.currentUserInfo.id
        // status: 1 // 0 未发送 1已发送 2 客服未处理消息
      }).then((res) => {
        this.historyChatList.push(...res.rows)
        console.log(res)
      })
    },

    dropdownClick (name) {
      console.log(name)
      console.log(this.selectedUser)
      if (name === 'checkHistoryChat') {
        this.getHistoryChat(this.params)
        this.chatVisbility = true
      } else if (name === 'clearHistoryChat') {
        this.clearHistoryChat()
      }
    },

    async handleReachBottom () {
      return new Promise((resolve) => {
        this.params.page = this.params.page + 1
        this.getHistoryChat(this.params).then(resolve)
      })
    },

    closeHistoryChat () {
      this.historyChatList = []
      this.params = {
        page: 1,
        rows: 10
      }
      this.chatVisbility = false
    },

    clearHistoryChat () {
      this.$Modal.confirm({
        title: '确认清除',
        content: '确定要清除与该用户的所有聊天记录吗？',
        onOk: async () => {
          try {
            await this.messageDB.clearUserMessages(this.selectedUser.fromUserId)
            // 清除内存中的消息
            this.messages = this.messages.filter(
              msg => msg.fromUserId !== this.selectedUser.fromUserId &&
                    msg.toUserId !== this.selectedUser.fromUserId
            )
            this.selectedUser = null
            this.$Message.success('聊天记录已清除')
          } catch (error) {
            console.error('清除聊天记录失败:', error)
            this.$Message.error('清除失败，请重试')
          }
        }
      })
    }
  },

  async mounted () {
    this.messageDB = new MessageDB()
    await this.loadHistoryMessages()
    await this.$store.dispatch('initWebSocket')

    if (this.ws) {
      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          this.handleNewMessage(message)
          console.log('发来消息了', message)
        } catch (error) {
          console.error('消息解析错误:', error)
        }
      }
    }
  },

  beforeDestroy () {
    if (this.ws) {
      this.ws.onmessage = null
    }
  }
}
</script>

<style scoped>
.chat-container {
  height: 100%;
  background: #f5f5f5;
}

.h-full {
  height: 100%;
}

.user-list {
  border-right: 1px solid #e8e8e8;
  background: white;
  padding: 0 10px;
}

.chat-area {
  padding: 16px;
}

.chat-window {
  height: 100%;
}

.message-area {
  height: calc(100vh - 400px);
  overflow-y: auto;
  padding: 16px;
}

.message-wrapper {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.message-content {
  display: flex;
  align-items: flex-start;
  max-width: 70%;
}

.message-right {
  align-items: flex-end;

  .message-content {
    flex-direction: row-reverse;
    margin-left: auto;
  }

  .message-bubble {
    background: #2d8cf0;
    color: white;
    margin: 0 8px 0 0;
  }

  .message-time {
    text-align: right;
  }
}

.message-avatar {
  margin: 0 8px;
}

.message-bubble {
  padding: 10px 16px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  margin: 0 0 0 8px;
  word-break: break-word;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  padding: 0 48px;
}

.input-area {
  margin: 21px 0;
  background: white;
  padding: 16px;
  border-radius: 4px;
}

.send-button {
  margin-top: 8px;
  float: right;
}

.no-chat-selected {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;

  .ivu-icon {
    margin-bottom: 16px;
  }
}
</style>
