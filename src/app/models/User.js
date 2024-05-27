const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        imgid: { 
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['admin', 'lecturer', 'student','none'],
            default: 'none',
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
          },
        isVerifiedbyInstructor: {
            type: Number,
            enum: [0, 1, 2, 3],
            default: 0,
        },
        proficiency: {
            type: String,
            default: '',
          },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('User', userSchema);
