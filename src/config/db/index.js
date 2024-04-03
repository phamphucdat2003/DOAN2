const mongoose = require('mongoose');
//Tóm lại, dòng mã mongoose.set('strictQuery', true); được sử dụng để bật chế độ kiểm tra nghiêm ngặt khi thực hiện truy vấn trong Mongoose.
mongoose.set('strictQuery', true);
async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/DOAN-2');
        console.log('Connect thanh cong');
    } catch (error) {
        console.log('Connect that bai');
    }
}

module.exports = { connect };
