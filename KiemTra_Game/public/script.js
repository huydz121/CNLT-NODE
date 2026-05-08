const socket = io();

const loginScreen = document.getElementById('login-screen');
const gameScreen = document.getElementById('game-screen');
const usernameInput = document.getElementById('username-input');
const joinBtn = document.getElementById('join-btn');
const userList = document.getElementById('user-list');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 1. Vào game
joinBtn.addEventListener('click', () => {
    const name = usernameInput.value.trim();
    if (name) {
        socket.emit('login', name);
        loginScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
    }
});

// 2. Cập nhật danh sách online
socket.on('update_users', (users) => {
    userList.innerHTML = '';
    users.forEach(u => {
        const li = document.createElement('li');
        li.innerText = '🟢 ' + u;
        userList.appendChild(li);
    });
});

// 3. Di chuyển bằng phím WASD
const keys = { up: false, down: false, left: false, right: false };
window.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'ArrowUp') keys.up = true;
    if (e.key === 's' || e.key === 'ArrowDown') keys.down = true;
    if (e.key === 'a' || e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'd' || e.key === 'ArrowRight') keys.right = true;
});
window.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'ArrowUp') keys.up = false;
    if (e.key === 's' || e.key === 'ArrowDown') keys.down = false;
    if (e.key === 'a' || e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'd' || e.key === 'ArrowRight') keys.right = false;
});

setInterval(() => {
    if (!loginScreen.classList.contains('hidden')) return;
    socket.emit('move', keys);
}, 1000 / 60);

// 4. Click chuột để bắn
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    socket.emit('shoot', { x: e.clientX - rect.left, y: e.clientY - rect.top });
});

// 5. Vẽ đồ họa
socket.on('gameState', (state) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ đạn
    ctx.fillStyle = '#ffea00';
    state.bullets.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });

    // Vẽ người chơi
    for (let id in state.players) {
        const p = state.players[id];
        
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${p.name} (${p.score})`, p.x, p.y - 30);

        ctx.fillStyle = '#cc0000';
        ctx.fillRect(p.x - 20, p.y - 25, 40, 5);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(p.x - 20, p.y - 25, (p.hp / 100) * 40, 5);
    }
});