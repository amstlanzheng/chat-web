<template>
  <div class="chat-box">
    <div class="messages" ref="messagesContainer">
      <div
        v-for="msg in messages"
        :key="msg.uuid"
        :class="{
          'user-message': msg.role === 'user',
          'assistant-message': msg.role === 'assistant',
        }"
      >
        <template v-if="msg.role === 'user'">
          <div>
            <!-- <div class="chat-from-right" v-html="renderMarkdown(msg.content)"></div> -->

            <div class="chat-from-right">{{ msg.content }}</div>
            <div class="image-ave-head-right">
              <img
                src="/image/user.png"
                class="image-ave-right"
                alt="用户头像"
              />
            </div>
          </div>
        </template>
        <template v-else>
          <!-- <strong>{{ msg.role }}:</strong>  -->
          <div>
            <div class="image-ave-head">
              <img
                src="/image/assistant.png"
                class="image-ave-left"
                alt="机器人头像"
              />
            </div>
            <!-- <div class="chat-from-left" v-html="renderMarkdown(msg.content)"></div> -->
            <div class="chat-from-left dialog">
              {{ msg.content }}
            </div>
          </div>
        </template>
      </div>
    </div>
    <el-divider />
    <div class="input-area">
      <el-input
        v-model="userInput"
        placeholder="输入消息..."
        @keydown.enter="sendMessage"
      />
      <el-button type="primary" @click="sendMessage">发送</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { marked } from "marked";
const messages = ref([]);
const userInput = ref("");
const uuid = ref("");
const renderMarkdown = (text) => {
  return marked(text);
};

const { $axios } = useNuxtApp(); // 使用注入的 Axios 实例
const messagesContainer = ref(null);

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};
const initializeChat = async () => {
  try {
    const response = await $axios.post("/init"); // 直接使用相对路径
    if (response.message === "操作成功") {
      uuid.value = response.data.uuid; // 存储 UUID
      messages.value.push({
        role: response.data.role,
        content: response.data.content,
        uuid: response.data.uuid,
      });
      scrollToBottom(); // 调用滚动函数
    }
  } catch (error) {
    console.error("初始化聊天失败:", error.message);
  }
};

const fetchMessages = async () => {
  try {
    const response = await $axios.get(`/getByUUID?UUID=${uuid.value}`); // 直接使用相对路径
    if (response.data) {
      messages.value = response.data.map((msg) => ({
        role: msg.role,
        content: msg.content,
        uuid: msg.uuid,
      }));
      scrollToBottom(); // 调用滚动函数
    }
  } catch (error) {
    console.error("获取消息失败:", error.message);
  }
};

const sendMessage = async () => {
  if (!userInput.value) return;

  const newMessage = {
    role: "user",
    content: userInput.value,
    uuid: uuid.value,
  };

  try {
    await $axios.post("/chat", newMessage); // 直接使用相对路径
    messages.value.push(newMessage); // 更新消息列表
    userInput.value = ""; // 清空输入框
    await fetchMessages(); // 获取更新后的消息
    scrollToBottom(); // 调用滚动函数
  } catch (error) {
    console.error("发送消息失败:", error.message);
  }
};

onMounted(() => {
  initializeChat();
});
</script>

<style scoped>
.chat-box {
  border: 1px solid #ccc;
  padding: 10px;
  max-width: 1000px;
  margin: 0 auto;
  margin-top: 20px;
  line-height: 2.5;
}
.messages {
  max-height: 700px;
  overflow-y: auto;
  margin-bottom: 10px;
}
.input-area {
  display: flex;
  justify-content: space-between;
}
.user-message {
  text-align: right; /* 用户消息靠右 */
}
.assistant-message {
  text-align: left; /* 助手消息靠左 */
}

.image-ave-right {
  width: 20px;
  height: auto; /* 保持宽高比 */
  margin-top: 20px;
  float: right;
}
.image-ave-left {
  width: 20px;
  height: auto; /* 保持宽高比 */
  margin-top: 20px;
  float: left;
}
.chat-from-right {
  width: 950px;
  margin-top: 10px;
  float: left;
}
.chat-from-left {
  width: 890px;
  margin-left: 20px;
  margin-top: 10px;
  float: left;
}
.image-ave-head {
  width: 20px;
}
.image-ave-head-right {
  float: right;
}
.dialog {
  border: 2px solid #86b4d2; /* 边框颜色 */
  border-radius: 10px; /* 边框圆角 */
  box-shadow: 0 4px 10px rgba(145, 143, 143, 0.2); /* 阴影效果 */
  padding: 20px; /* 内边距 */
  background-color: #fff; /* 背景颜色 */
}
</style>
