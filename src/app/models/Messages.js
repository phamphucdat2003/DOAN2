const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messagesSchema = new Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
        },
        isimg:{
            type: Boolean,
            default: false,
            required: true,
        },
        isfile:{
            type: Boolean,
            default: false,
            required: true,
        },
        retrieve:{
            type: Boolean,
            default: false,
            required: true,
        },
        show:{
            type: Boolean,
            default: true,
            required: true,
        }
        
    },
    {
        timestamps: true,
    },
);


module.exports = mongoose.model('Messages', messagesSchema);
