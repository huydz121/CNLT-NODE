const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const users = {}; // { "username": "socket_id" }

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // 1. Đăng nhập
    socket.on('login', (username) => {
        socket.username = username;
        users[username] = socket.id;
        io.emit('update_users', Object.keys(users));
    });

    // 2. Chat riêng tư
    socket.on('private_message', ({ receiver, message }) => {
        const receiverSocketId = users[receiver];
        const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receive_message', {
                sender: socket.username, message: message, time: time, isSelf: false
            });
            socket.emit('receive_message', {
                sender: socket.username, message: message, time: time, isSelf: true
            });
        }
    });

    // 3. Tính năng "Đang gõ phím..."
    socket.on('typing', (receiver) => {
        const receiverSocketId = users[receiver];
        if (receiverSocketId) io.to(receiverSocketId).emit('typing', socket.username);
    });

    socket.on('stop_typing', (receiver) => {
        const receiverSocketId = users[receiver];
        if (receiverSocketId) io.to(receiverSocketId).emit('stop_typing');
    });

    
    // 4. Ngắt kết nối
    socket.on('disconnect', () => {
        if (socket.username) {
            delete users[socket.username];
            io.emit('update_users', Object.keys(users));
        }
    });
});

server.listen(3000, () => {
    console.log('Server Chat PRO đang chạy tại http://localhost:3000');
});