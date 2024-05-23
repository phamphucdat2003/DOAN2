const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoresSchema = new Schema(
    {
        group: {
            type: Schema.Types.ObjectId,
            ref: 'Group',
            required: true,       
        },
        members: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,   
        }
    },
    {
        timestamps: true,
    },
);


module.exports = mongoose.model('Scores', scoresSchema);
