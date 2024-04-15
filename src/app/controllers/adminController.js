//chay cai mongodb
const { mutipleMongooseToObject,mongooseToObject } = require('../../util/mongoose');
const UserFake = require('../models/Userfake')
const User = require('../models/User')
const bcrypt = require('bcrypt');
const { deletafile } = require('../api/googleDriveAPI');
//----------------------------------------------------------------
class adminController {
    //[GET] /admin/duyet
    viewduyet(req, res,next) {
        UserFake.find({})
            .then((userfakes) => {
                res.render('admin/admin_duyet', {
                    userfakes: mutipleMongooseToObject(userfakes),
                    title:'Duyệt tài khoản'
                });
            })
            .catch(next);
    };

    //[post] /admin/registerTrue
    async registerTrue (req, res,next) {
        const { name, email, password, imgid, role } = req.body;
        try {
        // Tạo người dùng mới
        const newUser = new User({ name, email, password, imgid, role });
        await newUser.save();
        UserFake.deleteOne({email:email })
            .then(() => res.redirect('/admin/duyet'))
            .catch(err => console.error(err));
        }
        catch (error) {
        res.render('error/404',{title:'Error'})
        }
    };

    //[GET] /admin/qltk
    viewqltk(req, res,next) {
        User.find({})
            .then((users) => {
                res.render('admin/admin_quanlytaikhoan', {
                    users: mutipleMongooseToObject(users),
                    title:'Quản lý tài khoản'
                });
            })
            .catch(next);
    }

    //[DELETE] /admin/:id/forcedelete
    forcedelete(req, res, next) {
        const fileId = req.params.id
        User.deleteOne({ imgid: fileId })
            .then(() => res.redirect('back'))
            .catch(next);
        deletafile(fileId);
        
    }

    //[DELETE] /admin/f/:id/forcedelete
    deleteuserfake(req, res, next) {
        const fileId = req.params.id
        UserFake.deleteOne({ imgid: fileId })
            .then(() => res.redirect('back'))
            .catch(next);
        deletafile(fileId);
    }
    //[get] /admin/:id/edit-User
    edituser(req, res, next) {
        User.findById(req.params.id)
            .then((user) =>
                res.render('admin/admin_edit-user', {
                    user: mongooseToObject(user),
                    title:'Edit ' + user.name
                }),
            )
            .catch(next);
    }
    //[put] /manage/:id
    async update(req, res, next) {
        const { id } = req.params;
        const { name, email, password, passwordfake,imgid,role } = req.body;
        var PasswordTrue;
        console.log(name, email, password, passwordfake,imgid,role)
        console.log('ở đây nè !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        const hashedPassword = await bcrypt.hash(passwordfake, 10)
        passwordfake ? PasswordTrue = hashedPassword : PasswordTrue = password

        User.updateOne({ _id: id }, { $set: { name, email, password: PasswordTrue,imgid,role } })
            .then(() => res.redirect('/admin/qltk'))
            .catch(next);
        }
}
module.exports = new adminController();
