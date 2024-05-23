const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true
        },
        level: {
            type: String,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        userclass: {
            type: Schema.Types.ObjectId,
            ref: 'UserClass',   
        }
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Project', projectSchema);
