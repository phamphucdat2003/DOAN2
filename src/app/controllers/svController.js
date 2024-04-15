//chay cai mongodb
const { mutipleMongooseToObject } = require('../../util/mongoose');
const Project = require('../models/Project');
const User = require('../models/User');
const Group = require('../models/Group');
//----------------------------------------------------------------
class gvController {
    //[GET] /sv/doan
    viewdoan(req, res) {
        Project.find({}).populate('owner')
        .then((projects) => {
            res.render('sv/sv_doan', {
                projects: mutipleMongooseToObject(projects),
                title:'Đồ án'
            });
        })
        .catch((error) => console.log("loi ne ba!!!!!!!!!"))
    };
    //[POST] /sv/:id/john
    async johngroup(req, res) {
        const pjid = req.params.id;
        const userid = req.session.userId;
        const group = await Group.findOne({ project: pjid });

        if (!group) {
            const newGroup = await Group.create({ members: [userid], project: pjid });
            await newGroup.save();
            // console.log(newGroup);
            res.redirect('back');
        } else {
            // Kiểm tra xem sinh viên đã tồn tại trong mảng members hay chưa
            const isDuplicate = group.members.includes(userid);

            if (isDuplicate) {
                console.log('Sinh viên đã có trong nhóm');
                res.redirect('back');
            } else {
                group.members.push(userid);
                await group.save();
                // console.log(group);
                req.session.group = true;
                res.redirect('back');
            }
        }
    }



    //[GET] /sv/doan
    viewyeucau(req, res) {
        res.render('sv/sv_yeucau',{ title:'Yêu cầu'})
    };
    //[GET] /sv/doan
    viewnhantin(req, res) {
        res.render('sv/sv_nhantin',{ title:'Nhắn tin'})
    };
}
module.exports = new gvController();
