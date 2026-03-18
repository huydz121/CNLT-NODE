const express = require('express');
const app = express();

// Cấu hình template engine EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Phục vụ file tĩnh (CSS, Hình ảnh)
app.use(express.static('public'));

// Khai báo mảng dữ liệu (Đã thêm link hình ảnh)
const items = [
    { id: 1, name: 'KFC', description: 'Gà rán truyền thống vỏ giòn rụm.', price: '85.000', hot: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500' },
    { id: 2, name: "McDonald's", description: 'Burger bò phô mai lừng danh.', price: '65.000', hot: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500' },
    { id: 3, name: 'Pizza Hut', description: 'Pizza viền phô mai béo ngậy.', price: '150.000', hot: true, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500' },
    { id: 4, name: 'Lotteria', description: 'Gà rán sốt HS cay ngọt.', price: '75.000', hot: false, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500' },
    { id: 5, name: 'Jollibee', description: 'Mì Ý sốt cà chua thịt băm siêu cuốn.', price: '40.000', hot: true, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500' }
];

// Route 1: Trang chủ
app.get('/', (req, res) => {
    res.render('index', { title: 'Trang chủ - Fast Food Review' });
});

// Route 2: Trang danh sách
app.get('/list', (req, res) => {
    res.render('list', { title: 'Danh sách Quán', items: items });
});

// Route 3: Trang liên hệ
app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Liên hệ' });
});

// Route 4: Trang chi tiết (Route động)
app.get('/detail/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = items.find(x => x.id === id);
    
    if (!item) {
        return res.send('Không tìm thấy quán này!');
    }
    
    res.render('detail', { title: 'Chi tiết Quán', item: item });
});

// Khởi động server
app.listen(3000, () => {
    console.log('Server đang chạy tại http://localhost:3000');
});