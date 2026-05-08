const socket = io();

// DOM
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const usernameInput = document.getElementById('username-input');
const joinBtn = document.getElementById('join-btn');
const userList = document.getElementById('user-list');
const chatWithLabel = document.getElementById('chat-with');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');

let myUsername = '';
let currentReceiver = '';
let typingTimer;

// Hàm xử lý Đăng nhập
function handleLogin() {
    const name = usernameInput.value.trim();
    if (name) {
        myUsername = name;
        socket.emit('login', myUsername);
        loginScreen.classList.add('hidden');
        chatScreen.classList.remove('hidden');
    }
}

joinBtn.addEventListener('click', handleLogin);
// Nhấn phím Enter để đăng nhập
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
});

// Cập nhật danh sách
socket.on('update_users', (users) => {
    userList.innerHTML = '';
    users.forEach(user => {
        if (user !== myUsername) {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-solid fa-circle"></i> ${user}`;
            li.onclick = () => selectUser(user, li);
            // Nếu người này đang được chọn, giữ màu xanh cho họ
            if (user === currentReceiver) li.classList.add('active');
            userList.appendChild(li);
        }
    });
});

// Chọn người chat
function selectUser(user, liElement) {
    currentReceiver = user;
    chatWithLabel.textContent = user;
    messageInput.disabled = false;
    sendBtn.disabled = false;
    messageInput.focus();

    document.querySelectorAll('#user-list li').forEach(li => li.classList.remove('active'));
    liElement.classList.add('active');
    
    const welcome = document.querySelector('.welcome-text');
    if(welcome) welcome.style.display = 'none';
}

// Hàm xử lý Gửi tin nhắn
function sendMessage() {
    const msg = messageInput.value.trim();
    if (msg && currentReceiver) {
        socket.emit('private_message', { receiver: currentReceiver, message: msg });
        socket.emit('stop_typing', currentReceiver); 
        messageInput.value = '';
    }
}

sendBtn.addEventListener('click', sendMessage);
// Nhấn phím Enter để gửi tin
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Bắt trạng thái "Đang gõ phím"
messageInput.addEventListener('input', () => {
    if(currentReceiver) {
        socket.emit('typing', currentReceiver);
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            socket.emit('stop_typing', currentReceiver);
        }, 1500);
    }
});

// Nhận sự kiện "Đang gõ" (Hiện cục 3 chấm lên)
socket.on('typing', (sender) => {
    if (sender === currentReceiver) {
        typingIndicator.classList.remove('hidden');
    }
});

// Nhận sự kiện Ngừng gõ (Giấu cục 3 chấm đi)
socket.on('stop_typing', () => {
    typingIndicator.classList.add('hidden');
});

// In tin nhắn ra màn hình
socket.on('receive_message', (data) => {
    if (data.sender === currentReceiver || data.isSelf) {
        typingIndicator.classList.add('hidden'); // Có tin tới là ẩn 3 chấm
        
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${data.isSelf ? 'sent' : 'received'}`;
        msgDiv.innerHTML = `
            <span class="meta">${data.isSelf ? 'Bạn' : data.sender} • ${data.time}</span>
            ${data.message}
        `;
        messagesDiv.appendChild(msgDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
});
