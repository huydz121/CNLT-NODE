const BlogPost = require('../models/BlogPost');

// 1. Xem danh sách
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await BlogPost.find({}).sort({ _id: -1 });
        res.render('index', { posts });
    } catch (err) { res.status(500).send(err.message); }
};

// 2. Mở form tạo
exports.createPost = (req, res) => {
    res.render('create');
};

// 3. Lưu bài viết
exports.storePost = async (req, res) => {
    try {
        await BlogPost.create(req.body);
        res.redirect('/');
    } catch (err) { res.status(500).send(err.message); }
};

// 4. Xem chi tiết
exports.getPost = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        res.render('detail', { post });
    } catch (err) { res.status(404).send("Lỗi không tìm thấy"); }
};

// 5. Mở form sửa
exports.editPost = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        res.render('edit', { post });
    } catch (err) { res.status(404).send("Lỗi không tìm thấy"); }
};

// 6. Cập nhật bài
exports.updatePost = async (req, res) => {
    try {
        await BlogPost.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/blogposts/' + req.params.id);
    } catch (err) { res.status(500).send(err.message); }
};

// 7. Xóa bài
exports.deletePost = async (req, res) => {
    try {
        await BlogPost.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) { res.status(500).send(err.message); }
};