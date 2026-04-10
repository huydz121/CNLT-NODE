const { Transform } = require('stream');

class TextTransform extends Transform {
    // Hàm _transform này sẽ chặn ở giữa luồng để "xào nấu" dữ liệu
    _transform(chunk, encoding, callback) {
        // 1. Chuyển cục dữ liệu (buffer) thành chuỗi (string)
        let data = chunk.toString();

        // 2. Cắt bỏ cái chữ "transformData=" mà form HTML tự động gắn vào
        if (data.startsWith('transformData=')) {
            data = data.replace('transformData=', '');
        }

        // 3. Xử lý khoảng trắng: Form HTML thường biến dấu cách thành dấu "+"
        // Đoạn này giúp giải mã ngược lại thành khoảng trắng bình thường
        data = decodeURIComponent(data.replace(/\+/g, ' '));

        // 4. BIẾN THÀNH CHỮ IN HOA theo đúng yêu cầu đề bài
        const finalResult = `[✨ Kết quả Transform]: ${data.toUpperCase()}`;

        // 5. Đẩy kết quả đã xử lý đi tiếp (về phía Client)
        this.push(Buffer.from(finalResult));
        
        // 6. Báo cáo là xử lý xong chunk này rồi
        callback();
    }
}

module.exports = TextTransform;