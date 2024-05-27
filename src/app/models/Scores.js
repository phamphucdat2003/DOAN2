const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoresSchema = new Schema(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,   
        },
        scores:{
            type: Number,
            default: 0,
        },
        scoresbylec:{
            type: Number,
            default: 0,
        },
        completed: {
            type:Boolean,
            default: false,
        },
        userclass: {
            type: String, 
        }
    },
    {
        timestamps: true,
    },
);


module.exports = mongoose.model('Scores', scoresSchema);
