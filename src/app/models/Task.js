const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema(
    {
        title: {
            type: String,
            unique: true,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        Scores:{
            type: Number,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
            },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
            },
        datacomplete:{
            type : Date,
            default: Date.now,
        },
        iscomplete: {
            type: Boolean,
            default: false,
        },
        bylecturer: {
            type: Number,
            enum: [0,1,2],
            default: 0,
        }
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Task', taskSchema);
