const heavySync = (req, res) => {
    console.log("Bắt đầu xử lý Sync...");
    const start = Date.now();
    while (Date.now() - start < 3000) {} // Giả lập kẹt 3 giây
    console.log("Xong Sync!");
    res.json({ message: "Xử lý đồng bộ (Blocking) hoàn tất" });
};

const heavyAsync = (req, res) => {
    console.log("Bắt đầu xử lý Async...");
    setTimeout(() => {
        console.log("Xong Async!");
        res.json({ message: "Xử lý bất đồng bộ (Non-blocking) hoàn tất" });
    }, 3000);
};

module.exports = { heavySync, heavyAsync };