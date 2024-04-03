// controllers/godcatController.js
const Godcat = require('../models/Godcat'); // Đường dẫn đến tệp chứa mô hình Godcat
const faker = require('faker');
const moment = require('moment');
// Trường "key" sẽ được cập nhật ngẫu nhiên hàng ngày
const generateRandomKey = async function (req, res, next) {
  const currentDate = moment().startOf('day').toDate();

  // Kiểm tra xem có bản ghi nào có ngày trùng với hôm nay không
  const godcatdate = await Godcat.findOne({ createdAt: { $gte: currentDate } });

  // Nếu không có bản ghi nào có ngày trùng với hôm nay
  if (!godcatdate) {
    // Xóa các bản ghi cũ
    await Godcat.deleteMany({ createdAt: { $lt: currentDate } });

    // Tạo khóa ngẫu nhiên mới
    const randomKey = faker.random.alphaNumeric(6);

    // Tạo và lưu bản ghi mới
    const newRecord = await Godcat.create({ key: randomKey });
  } 
  next();
};
module.exports = generateRandomKey;