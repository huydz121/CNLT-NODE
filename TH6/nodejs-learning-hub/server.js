const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Gọi các Module tự tạo
const AppEmitter = require('./events/AppEmitter');
const TextTransform = require('./streams/TextTransform');
const EchoDuplex = require('./streams/EchoDuplex');

const myEmitter = new AppEmitter();
let eventCounter = 0;

myEmitter.on('userAction', (data, callback) => {
    eventCounter++;
    const logMsg = `[${new Date().toISOString()}] Sự kiện #${eventCounter}: User ${data.user} đã kích hoạt event.\n`;
    fs.appendFileSync(path.join(__dirname, 'data', 'log.txt'), logMsg);
    if(callback) callback(`Đã xử lý sự kiện! Biến đếm hiện tại: ${eventCounter}`);
});

myEmitter.once('serverStarted', () => {
    console.log('--- Hệ thống Emitter đã được khởi động ---');
});
myEmitter.emit('serverStarted');

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    // Đọc CSS
    if (pathname.endsWith('.css')) {
        const cssPath = path.join(__dirname, 'public', pathname);
        fs.readFile(cssPath, (err, data) => {
            if (err) { res.writeHead(404); return res.end(); }
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.write(data);
            res.end();
        });
        return; 
    }

    // Các trang HTML
    if (pathname === '/') {
        fs.readFile(path.join(__dirname, 'views', 'index.html'), (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write(data);
            res.end();
        });
    } 
    else if (pathname === '/events') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(path.join(__dirname, 'views', 'events.html')).pipe(res);
    }
    else if (pathname === '/request') {
        let html = fs.readFileSync(path.join(__dirname, 'views', 'request.html'), 'utf-8');
        html = html.replace('{{url}}', req.url)
                   .replace('{{method}}', req.method)
                   .replace('{{query}}', JSON.stringify(parsedUrl.query))
                   .replace('{{headers}}', JSON.stringify(req.headers, null, 2));

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'X-Student-Custom': 'Success' });
        res.end(html);
    }
    else if (pathname === '/streams') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(path.join(__dirname, 'views', 'streams.html')).pipe(res);
    }

    // Streams & Endpoints
    else if (pathname === '/streams/read') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        fs.createReadStream(path.join(__dirname, 'data', 'story.txt')).pipe(res);
    }
    else if (pathname === '/streams/write' && req.method === 'POST') {
        const writable = fs.createWriteStream(path.join(__dirname, 'data', 'output.txt'));
        req.pipe(writable);
        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h3>Đã ghi thành công!</h3><a href="/streams">Quay lại</a>');
        });
    }
    else if (pathname === '/streams/transform' && req.method === 'POST') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        req.pipe(new TextTransform()).pipe(res);
    }
    else if (pathname === '/streams/duplex' && req.method === 'POST') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        req.pipe(new EchoDuplex()).pipe(res);
    }
    else if (pathname === '/json') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 200, message: 'Dữ liệu JSON', data: { id: 1 } }));
    }
    else if (pathname === '/image') {
        res.writeHead(200, { 'Content-Type': 'image/png' });
        fs.createReadStream(path.join(__dirname, 'public', 'images', 'logo.png')).pipe(res);
    }
    else if (pathname === '/event') {
        myEmitter.emit('userAction', { user: 'SinhVienIT' }, (responseMsg) => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`<h3>Sự kiện đã chạy!</h3><p>${responseMsg}</p><a href="/events">Quay lại</a>`);
        });
    }
    else if (pathname === '/download-log') {
        res.writeHead(200, { 'Content-Disposition': 'attachment; filename=app-log.txt', 'Content-Type': 'text/plain; charset=utf-8' });
        fs.createReadStream(path.join(__dirname, 'data', 'log.txt')).pipe(res);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 - Not Found');
    }
});

server.listen(3000, () => {
    console.log(`Server đang chạy tại http://localhost:3000`);
});