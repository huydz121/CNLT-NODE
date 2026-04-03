const express = require('express');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');

const app = express();

// 1. Kết nối Database
connectDB();

// 2. Cấu hình
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// 3. Sử dụng Routes
app.use('/', postRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server MVC chạy tại http://localhost:${PORT}`));