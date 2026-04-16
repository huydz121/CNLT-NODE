const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// 1. Cấu hình Multer để lưu trữ file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Đảm bảo thư mục uploads tồn tại
        if (!fs.existsSync("uploads")) {
            fs.mkdirSync("uploads");
        }
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        // Đặt tên: Thời gian hiện tại + tên gốc để không bị trùng
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// Cấu hình giới hạn tối đa 17 file như đề bài yêu cầu
const uploadManyFiles = multer({ storage: storage }).array("many-files", 17);

// 2. Giao diện trang chủ
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/master.html"));
});

// 3. Route xử lý upload
app.post("/upload", (req, res) => {
    uploadManyFiles(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.send("Lỗi: Giới hạn upload tối đa 17 file hoặc lỗi hệ thống!");
        }
        
        if (!req.files || req.files.length === 0) {
            return res.send("Bạn chưa chọn file nào!");
        }

        console.log(`Đã nhận ${req.files.length} file.`);
        res.send(`<h3>Upload nhiều file thành công! (${req.files.length} file)</h3> <a href="/">Quay lại</a>`);
    });
});

// Chạy server tại cổng 8017
app.listen(8017, () => {
    console.log("Server chay tai http://localhost:8017");
});