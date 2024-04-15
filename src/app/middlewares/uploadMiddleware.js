const multer = require('multer');

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Thư mục lưu trữ file tải lên
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Tên file sẽ được giữ nguyên
  }
});

const upload = multer({ storage: storage }).single('imgfile'); // Tên trường file trong form

// Middleware xử lý tải file
const uploadMiddleware = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      // Xử lý lỗi
      return res.status(500).json({ error: err.message });
    }
    // Chuyển tiếp đến middleware hoặc controller tiếp theo
    next();
  });
};

module.exports = uploadMiddleware;