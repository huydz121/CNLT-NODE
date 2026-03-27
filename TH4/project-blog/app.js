const express = require('express');
const mongoose = require('mongoose');
const BlogPost = require('./models/BlogPost');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Cực kỳ quan trọng để nhận CSS
app.set('view engine', 'ejs');

// Kết nối đến MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/blogDB')
    .then(() => console.log('✅ Đã thông tới MongoDB rồi Huy ơi!'))
    .catch(err => console.log('❌ Lỗi kết nối:', err));

app.get('/', async (req, res) => {
    const posts = await BlogPost.find({}).sort({ _id: -1 });
    res.render('index', { posts });
});

app.get('/blogposts/new', (req, res) => {
    res.render('create');
});

app.post('/blogposts/store', async (req, res) => {
    await BlogPost.create(req.body);
    res.redirect('/');
});

app.get('/blogposts/:id', async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    res.render('detail', { post });
});

app.post('/blogposts/delete/:id', async (req, res) => {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.redirect('/');
});
// 1. Mở trang chỉnh sửa (Lấy dữ liệu cũ đổ vào form)
app.get('/blogposts/edit/:id', async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    res.render('edit', { post });
});

// 2. Xử lý cập nhật dữ liệu mới vào MongoDB
app.post('/blogposts/update/:id', async (req, res) => {
    await BlogPost.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body
    });
    res.redirect('/blogposts/' + req.params.id); // Sửa xong thì xem lại chi tiết
});
app.listen(3000, () => console.log('🚀 Server đang chạy tại: http://localhost:3000'));