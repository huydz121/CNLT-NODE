const http = require('http');
const url = require('url');
const fs = require('fs');

// ==========================================
// PHẦN 3: TẠO FILE BẰNG FS MODULE (Tự động sinh ra cats.txt)
// ==========================================
let fileContent = 'Ragdoll, Scottish fold, British shorthair...';
let filePath = './files/cats.txt';

fs.writeFile(filePath, fileContent, (err) => {
    if(err) throw err;
    console.log('>>> Da tao file cats.txt thanh cong trong thu muc files!');
});

// ==========================================
// PHẦN 4: KHỞI TẠO SERVER & ROUTING
// ==========================================
const server = http.createServer((req, res) => {
    let urlData = url.parse(req.url, true);
    let pathname = urlData.pathname;

    // Cấp phép cho HTML đọc file CSS (Làm cho web đẹp)
    if (pathname === '/style.css') {
        fs.readFile('./css/style.css', (err, data) => {
            if (err) return res.end();
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data);
            return res.end();
        });
        return;
    }

    // Xử lý các trang HTML y hệt tài liệu
    let fileName = './views' + pathname;
    if (pathname === '/') {
        fileName = './views/index.html';
    }

    fs.readFile(fileName, (err, data) => {
        if (err) {
            console.log(err);
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write('404 Not Found');
            return res.end();
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
});

// Bật Server lắng nghe
server.listen(8017, 'localhost', () => {
    console.log(">>> Server dang chay tai: http://localhost:8017");
});