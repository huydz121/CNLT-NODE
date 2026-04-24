const express = require('express');
const session = require('express-session');
const { logger, requireLogin, errorHandler } = require('./middleware');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const testRoutes = require('./routes/testRoutes');

const app = express();

app.use(express.json());
app.use(session({
    secret: 'huydz_key',
    resave: false,
    saveUninitialized: true
}));

app.use(logger); // Middleware in LOG mọi request

// Routes
app.use('/', authRoutes);
app.use('/', testRoutes);
app.use('/students', requireLogin, studentRoutes); // requireLogin bảo vệ toàn bộ API sinh viên

app.use(errorHandler); // Middleware báo lỗi

app.listen(3000, () => {
    console.log("Server TH9-2 (Module) đang chạy tại http://localhost:3000");
});