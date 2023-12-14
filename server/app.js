const express = require('express');
const app = express();
const http = require('http');

const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        // origin: "http://localhost:4000"
        origin: "*", // Cho phép truy cập từ mọi nguồn, cần điều chỉnh cho phù hợp
    }
});

io.on("connection", (socket) => {

    console.log('New client connected', socket.id);

    // TEST - start
    //1
    // socket.emit('server-message', 'Hello from server!');
    // socket.emit('server-event-thanghn', 'thanghoangngocket');
    //2
    // socket.once('testOnce', (data) => {
    //     console.log('testOnce', data);
    // })


    const socketMap = {};

    socket.on('send-to-client', ({ dstAccountId, socketId }) => {
        console.log('data', dstAccountId, socketId,)
        socketMap[dstAccountId] = socket;
        if (dstAccountId in socketMap) {
            const socket = socketMap[dstAccountId];
            socket.emit('message-from-server', 'thanh cong')
        }
    });


    socket.on('register_client', (clientSocketID) => {
        console.log(`Registered client with ID: ${clientSocketID}`);
        // Gửi tin nhắn đến client cụ thể (ví dụ)
        io.to(clientSocketID).emit('message', 'Xin chào từ server!');
    });

    // TEST - end

    socket.on('joinRoom', (data) => {
        socket.join(data?.roomId);
        console.log(`Người dùng ' ${data?.name} ' đã tham gia phòng ${data?.roomId}`);
    });

    socket.on('sendMessage', (data) => {
        io.to(data?.roomId).emit('receiveMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = 8888; // Make sure this matches the Vue client's connection URL
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));