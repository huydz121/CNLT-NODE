// Middleware Logger (In phương thức và URL)
const logger = (req, res, next) => {
    console.log(`[LOG] ${req.method} ${req.url}`);
    next();
};

// Middleware kiểm tra đăng nhập
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Chưa đăng nhập! Vui lòng đăng nhập (401)" });
    }
    next();
};

// Middleware xử lý lỗi chung
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Lỗi Server Nội Bộ!" });
};

module.exports = { logger, requireLogin, errorHandler };