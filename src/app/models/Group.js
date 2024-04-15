const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema(
    {
        members: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        project: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true,       
        },
    },
    {
        timestamps: true,
    },
);


module.exports = mongoose.model('Group', groupSchema);
