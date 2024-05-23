const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const votecompleteSchema = new Schema(
    {
        membersisvoted: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        group: {
            type: Schema.Types.ObjectId,
            ref: 'Group',
            required: true,       
        },
        timelife:{
            type : Date,
            default: Date.now,
        },
        iscomplete: {
            type : Boolean,
            default: false,
        },
        iscompletebylec: {
            type : Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    },
);


module.exports = mongoose.model('Votecomplete', votecompleteSchema);
