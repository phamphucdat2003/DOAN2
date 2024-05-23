const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userclassSchema = new Schema(
    {
        name:{
            type: String,
            enum: ['Công Nghệ Thông Tin', 'Khoa Học Dữ liệu', 'Khoa Học Máy Tính','Kỹ Thuật Phần Mềm','Hệ Thống Thông Tin'],
            required: true,
            unique: true
        },
        members: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }]
    },
    {
        timestamps: true,
    },
);


module.exports = mongoose.model('UserClass', userclassSchema);
