<template>
  <div>
    <h1>Socket.io with Vue 3</h1>
    <br />
    <p>Message from server-message: {{ message }}</p>
    <br />
    <p>Message from server-event-thanghn: {{ valueServer }}</p>

    <p>{{ messages }}</p>
    <div v-for="msg in messages" :key="msg">{{ msg }}</div>

    <input v-model="name" placeholder="Nhập tên bạn" />

    <div>
      <input v-model="roomId" placeholder="Nhập ID phòng" />
      <button @click="joinRoom">Tham gia phòng</button>
      <input v-model="newMessage" placeholder="Nhập tin nhắn" />
      <button @click="sendMessage">Gửi</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'

export default {
  setup() {
    const socket = io('http://localhost:8888') // replace with your server URL
    const message = ref('')
    const valueServer = ref('')

    const name = ref('')
    const roomId = ref('')
    const newMessage = ref('')
    const messages = ref([])

    const joinRoom = () => {
      socket.emit('joinRoom', {
        name: name.value,
        roomId: roomId.value
      })
    }

    const sendMessage = () => {
      socket.emit('sendMessage', {
        name: name.value,
        roomId: roomId.value,
        newMessage: newMessage.value
      })
      newMessage.value = ''
    }

    onMounted(() => {
      socket.on('connect', () => {
        console.log('Connected to the socket server')
      })

      // socket.on('server-message', (msg) => {
      //   message.value = msg
      // })
      // socket.on('server-event-thanghn', (msg) => {
      //   valueServer.value = msg
      // })

      socket.on('receiveMessage', (data) => {
        messages.value.push(data.name+ ": "+ data.newMessage)
      })
    })

    onUnmounted(() => {
      socket.disconnect()
    })

    return {
      message,
      valueServer,
      name,
      roomId,
      newMessage,
      messages,
      joinRoom,
      sendMessage
    }
  }
}
</script>