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
        imglink: {
            type: String,
            default:"https://th.bing.com/th/id/OIP.DEZfPfqxguvbExIzlmi5OwAAAA?w=474&h=417&rs=1&pid=ImgDetMain"
        }
    },
    {
        timestamps: true,
    },
);


module.exports = mongoose.model('Group', groupSchema);
