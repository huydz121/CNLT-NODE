const { Duplex } = require('stream');

class EchoDuplex extends Duplex {
    // 1. Cài đặt _read (Luồng đọc)
    _read(size) {
        // Không chủ động sinh dữ liệu, chờ được đẩy vào từ _write
    }

    // 2. Cài đặt _write (Luồng ghi)
    _write(chunk, encoding, callback) {
        const reply = `[Server Echo] Ban vua gui thong tin: ${chunk.toString()}`;
        this.push(Buffer.from(reply));
        callback();
    }

    // 3. THÊM HÀM NÀY: Chốt sổ báo hiệu kết thúc luồng
    _final(callback) {
        this.push(null); // Đẩy null để đóng kết nối, báo cho trình duyệt biết là đã xong!
        callback();
    }
}

module.exports = EchoDuplex;