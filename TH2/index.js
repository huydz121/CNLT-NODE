const express = require('express');
const path = require('path');
const app = new express();

// Yêu cầu 8: Cấu hình truy cập tài nguyên tĩnh
app.use(express.static('public'));

// Yêu cầu 10: Route trang chủ trả về file HTML từ thư mục pages
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/index.html'));
});

// Yêu cầu 3: Chạy server trên port 4000
app.listen(4000, () => {
    console.log('Server đang chạy tại http://localhost:4000');
});