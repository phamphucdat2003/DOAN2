const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const instructorSchema = new Schema(
    {
        instructorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            unique: true,
        },
        studentsId: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }]

    },
    {
        timestamps: true,
    },
);


module.exports = mongoose.model('Instructor', instructorSchema);
