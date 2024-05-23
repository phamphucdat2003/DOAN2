//chay cai mongodb
const { mutipleMongooseToObject,mongooseToObject } = require('../../util/mongoose');
const User = require('../models/User')
const UserClass = require('../models/Userclass');
const bcrypt = require('bcrypt');
const { deletafile } = require('../api/googleDriveAPI');
//----------------------------------------------------------------
class adminController {
    //[GET] /admin/duyet
    viewduyet(req, res,next) {
        User.find({$or: [{ isVerified: false },{ isVerified: { $exists: false } }]})    
            .then((userfakes) => {
                res.render('admin/admin_duyet', {
                    userfakes: mutipleMongooseToObject(userfakes),
                    title:'Duyệt tài khoản'
                });
            })
            .catch((error) => {
                console.error(error);
                res.render('error/404',{
                    title:'LỖI HỆ THỐNG',
                    home:true
                });
              });
    };
    verified (req, res, next) {
        const { userId,role } = req.params;
        User.updateOne({ _id: userId }, { $set: { role, isVerified:true} })
            .then(() => res.redirect('/admin/duyet'))
            .catch((error) => {
                console.error(error);
                res.render('error/404',{
                    title:'LỖI HỆ THỐNG',
                    home:true
                });
              });
    }

    //[GET] /admin/qltk
    viewqltk(req, res,next) {
        User.find({isVerified:true})
            .then((usersHaveAdmin) => {
                
                const users = usersHaveAdmin.filter(user => user.role !== 'admin');
                res.render('admin/admin_quanlytaikhoan', {
                    users: mutipleMongooseToObject(users),
                    title:'Quản lý tài khoản'
                });
            })
            .catch((error) => {
                console.error(error);
                res.render('error/404',{
                    title:'LỖI HỆ THỐNG',
                    home:true
                });
              });
    }

    //[DELETE] /admin/:id/forcedelete
    forcedelete(req, res, next) {
        const fileId = req.params.id
        User.deleteOne({ imgid: fileId })
            .then(() => {
                deletafile(fileId);
                res.redirect('back')
            })
            .catch((error) => {
                console.error(error);
                res.render('error/404',{
                    title:'LỖI HỆ THỐNG',
                    home:true
                });
              });
        
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
            .catch((error) => {
                console.error(error);
                res.render('error/404',{
                    title:'LỖI HỆ THỐNG',
                    home:true
                });
              });
    }
    //[put] /admin/:userId/:role/verified
    async update(req, res, next) {
        const { id } = req.params;
        const { name, email, password, passwordfake,imgid,role } = req.body;
        var PasswordTrue;
        // console.log(name, email, password, passwordfake,imgid,role)
        // console.log('ở đây nè !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        try {
            passwordfake ? PasswordTrue = await bcrypt.hash(passwordfake, 10) : PasswordTrue = password
        } catch (error) {
            console.error(error);
            res.render('error/404',{
                title:'LỖI HỆ THỐNG',
                home:true
            });
        }

        User.updateOne({ _id: id }, { $set: { name, email, password: PasswordTrue,imgid,role } })
            .then(() => res.redirect('/admin/qltk'))
            .catch((error) => {
                console.error(error);
                res.render('error/404',{
                    title:'LỖI HỆ THỐNG',
                    home:true
                });
              });
        }

    async addclass (req, res,next) {
        const classUser = new UserClass(req.body);
            classUser
                .save()
                .then(() => {
                    console.log('thêm thành công')
                })
                .catch((error) => {
                    console.error(error);
                    res.render('error/404',{
                        title:'LỖI HỆ THỐNG',
                        home:true
                    });
                  });
    }
}
module.exports = new adminController();
