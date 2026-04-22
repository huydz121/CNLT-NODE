const express = require('express');
const session = require('express-session');
const fs = require('fs');
const app = express();

// Middleware đọc JSON
app.use(express.json());

// Cấu hình Session cho Bài 3
app.use(session({
    secret: 'huydz121_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Để false vì mình chạy trên localhost (HTTP)
}));

// Dữ liệu mẫu cho Bài 1 & 5
let students = [
    { id: 1, name: "Nguyen Van An", email: "an@gmail.com" },
    { id: 2, name: "Tran Thi Binh", email: "binh@gmail.com" },
    { id: 3, name: "Le Van Cuong", email: "cuong@gmail.com" },
    { id: 4, name: "Pham Minh Duc", email: "duc@gmail.com" },
    { id: 5, name: "Nguyen Khac Huy", email: "huy@gmail.com" }
];

// Hàm kiểm tra Email đúng định dạng
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// --- TRANG CHỦ (Để không bị báo lỗi Cannot GET /) ---
app.get('/', (req, res) => {
    res.send("<h1>Server TH9 của Huy đang chạy!</h1><p>Dùng Postman hoặc trình duyệt để test các API nhé.</p>");
});

// --- BÀI 1 & 5: QUẢN LÝ SINH VIÊN ---

// Tìm kiếm (Search) - Phải đặt trước các route có :id
app.get('/students/search', (req, res) => {
    const name = req.query.name;
    if (!name) return res.status(400).json({ error: "Thiếu tham số name để tìm" });
    const result = students.filter(s => s.name.toLowerCase().includes(name.toLowerCase()));
    res.json(result);
});

// Lấy danh sách & Phân trang (Bài 5)
app.get('/students', (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (page && limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = students.slice(startIndex, endIndex);
        return res.json({
            currentPage: page,
            limit: limit,
            total: students.length,
            data: result
        });
    }
    res.json(students);
});

// Chi tiết 1 sinh viên
app.get('/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).json({ error: "Không thấy SV này" });
    res.json(student);
});

// Thêm sinh viên (POST) + Validate
app.post('/students', (req, res) => {
    const { name, email } = req.body;
    if (!name || name.length < 2) return res.status(400).json({ error: "Tên phải >= 2 ký tự" });
    if (!email || !isValidEmail(email)) return res.status(400).json({ error: "Email sai định dạng" });
    if (students.some(s => s.email === email)) return res.status(400).json({ error: "Email đã tồn tại" });

    const newStudent = { id: students.length + 1, name, email };
    students.push(newStudent);
    res.status(201).json(newStudent);
});

// Cập nhật (PUT)
app.put('/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).json({ error: "Không thấy SV" });
    
    const { name, email } = req.body;
    if (name) student.name = name;
    if (email) student.email = email;
    res.json({ message: "Đã cập nhật", data: student });
});

// Xóa (DELETE)
app.delete('/students/:id', (req, res) => {
    const index = students.findIndex(s => s.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Không thấy SV" });
    students.splice(index, 1);
    res.json({ message: "Đã xóa thành công" });
});

// --- BÀI 2: BLOCKING VS NON-BLOCKING ---

app.get('/sync', (req, res) => {
    console.log("Đang đọc file ĐỒNG BỘ...");
    const data = fs.readFileSync('test.txt', 'utf8');
    console.log("Xong Blocking!");
    res.send("Dữ liệu (Sync): " + data);
});

app.get('/async', (req, res) => {
    console.log("Đang đọc file BẤT ĐỒNG BỘ...");
    fs.readFile('test.txt', 'utf8', (err, data) => {
        if (err) return res.status(500).send("Lỗi đọc file");
        console.log("Xong Non-blocking!");
        res.send("Dữ liệu (Async): " + data);
    });
    console.log("Lệnh này chạy TRƯỚC khi file đọc xong (Minh chứng Non-blocking)");
});

// --- BÀI 3: SESSION & ĐĂNG NHẬP ---

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '123456') {
        req.session.user = { username: 'admin', role: 'admin' };
        return res.json({ message: "Đăng nhập thành công!" });
    }
    res.status(400).json({ error: "Sai tài khoản hoặc mật khẩu" });
});

app.get('/profile', (req, res) => {
    if (req.session.user) {
        res.json({ message: "Thông tin hồ sơ", user: req.session.user });
    } else {
        res.status(400).json({ error: "Bạn chưa đăng nhập" });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: "Đã đăng xuất" });
});

// CHẠY SERVER
app.listen(3000, () => {
    console.log("Server Huy đang chạy tại http://localhost:3000");
});