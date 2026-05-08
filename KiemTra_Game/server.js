const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const players = {};
let bullets = [];

io.on('connection', (socket) => {
    // 1. Đăng nhập vào Game
    socket.on('login', (name) => {
        players[socket.id] = {
            x: Math.random() * 600 + 100, // Quăng ngẫu nhiên trên bản đồ
            y: Math.random() * 400 + 100, 
            hp: 100, 
            name: name,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            score: 0
        };
        // Cập nhật danh sách "Đang Sống"
        io.emit('update_users', Object.values(players).map(p => p.name));
    });

    // 2. Nhận tín hiệu di chuyển
    socket.on('move', (keys) => {
        const p = players[socket.id];
        if (!p) return; // Chết rồi là không cho nhúc nhích nữa
        if (keys.up) p.y -= 5;
        if (keys.down) p.y += 5;
        if (keys.left) p.x -= 5;
        if (keys.right) p.x += 5;
        
        // Giới hạn bản đồ không cho chạy văng ra ngoài
        p.x = Math.max(20, Math.min(780, p.x));
        p.y = Math.max(20, Math.min(580, p.y));
    });

    // 3. Nhận tín hiệu bắn súng
    socket.on('shoot', (target) => {
        const p = players[socket.id];
        if (!p || p.hp <= 0) return; // Chết rồi không cho bắn
        const angle = Math.atan2(target.y - p.y, target.x - p.x);
        bullets.push({
            x: p.x, y: p.y,
            dx: Math.cos(angle) * 15, dy: Math.sin(angle) * 15,
            ownerId: socket.id
        });
    });

    // 4. Thoát mạng (Tự bấm X tắt trình duyệt)
    socket.on('disconnect', () => {
        if (players[socket.id]) {
            delete players[socket.id];
            io.emit('update_users', Object.values(players).map(p => p.name));
        }
    });
});

// VÒNG LẶP XỬ LÝ VA CHẠM (60 FPS)
setInterval(() => {
    for (let i = bullets.length - 1; i >= 0; i--) {
        let b = bullets[i];
        b.x += b.dx; b.y += b.dy;
        
        // Đạn bay ra khỏi màn hình thì xóa
        if (b.x < 0 || b.x > 800 || b.y < 0 || b.y > 600) {
            bullets.splice(i, 1);
            continue;
        }
        
        // Kiểm tra đạn trúng ai không
        for (let id in players) {
            if (id !== b.ownerId) {
                const p = players[id];
                const dist = Math.hypot(p.x - b.x, p.y - b.y);
                
                if (dist < 25) { // Bị trúng đạn
                    p.hp -= 20; // Mất 20 máu
                    bullets.splice(i, 1); // Xóa viên đạn
                    
                    // NẾU HẾT MÁU -> BỊ KÍCH KHỎI GAME
                    if (p.hp <= 0) {
                        // Cộng điểm cho sát thủ
                        if (players[b.ownerId]) players[b.ownerId].score += 1;
                        
                        // Xóa sổ nạn nhân khỏi máy chủ
                        delete players[id];
                        
                        // Ép cập nhật lại danh sách "Đang Sống" bên trái màn hình
                        io.emit('update_users', Object.values(players).map(p => p.name));
                    }
                    break;
                }
            }
        }
    }
    // Phát sóng tọa độ mới nhất để vẽ đồ họa
    io.emit('gameState', { players, bullets });
}, 1000 / 60);

server.listen(3000, () => {
    console.log('Game Server Quy Nhon Arena chạy tại: http://localhost:3000');
});