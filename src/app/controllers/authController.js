// controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Group = require('../models/Group');
const Instructor = require('../models/Instructor');
const UserClass = require('../models/Userclass');
const { mutipleMongooseToObject,mongooseToObject } = require('../../util/mongoose');
const fs = require('fs');
const { uploadfile,deletafile } = require('../api/googleDriveAPI');

class authController {
    //[get] /auth/register
  viewregister (req, res) {
    res.render('auth/register',{title:'Register',overlay:false});
  };
  //[post] /auth/register
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      // console.log(name, email, password);
      const imgfile = req.file.path;
      let imgname; // Khai báo biến imgname trước khi sử dụng

      const atIndex = email.indexOf("@"); // Tìm chỉ mục của dấu @ trong chuỗi email
      if (atIndex !== -1) {
        imgname = email.slice(0, atIndex); // Gán giá trị cho biến imgname
      } else {
        imgname = name; // Gán giá trị cho biến imgname
      }
      // console.log(imgname);
      // console.log('aaaaaaaaaaaaaa')

      const existingUser = await User.findOne({email});
      // console.log(existingUser)
      if (existingUser) {
        fs.unlink(imgfile, (err) => {
          if (err) {
            console.log(err);
          }
        });
      return res.render('auth/register',{title:'register',overlay:true});
      } else {
          try {
            const fileId = await uploadfile(imgname,imgfile);
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
              name,
              email,
              password:hashedPassword,
              isVerifiedbyInstructor:3,
              imgid:fileId
            });
            await user.save();
      
            // Xóa tệp tải lên sau khi hoàn thành
            fs.unlink(imgfile, (err) => {
              if (err) {
                console.log(err);
              }
            });
      
            res.redirect('/');
          } catch (error) {
            console.log(error);
            // Xóa tệp tải lên nếu có lỗi xảy ra
            fs.unlink(imgfile, (err) => {
              if (err) {
                console.log(err);
              }
            });
            return res.render('error/404', { title: 'Error' });
          }
      }
                                   
    } catch (error) {
      console.log(error);
      res.render('error/404', { title: 'Error' });
    }
  }

  //[get] /auth/login
  viewlogin (req, res) {
    const errorPassword = req.session.errorPassword;
    const errorName = req.session.errorName;
    delete req.session.errorPassword;
    delete req.session.errorName;

    if (req.session.userId) {
      res.redirect('/')
    }else {
      res.render('auth/login',{ errorN: errorName , errorP: errorPassword,title:'Login'});
    }
  };



  
  //[post] /auth/login
  async login (req, res) {
    const { email, password } = req.body;
    try {
      // Tìm người dùng trong cơ sở dữ liệu
      // console.log(email,password);
      const user = await User.findOne({ email,isVerified:true });
      // console.log(user);
      if (!user) {
        req.session.errorName = 'Sai tài khoản. Vui lòng thử lại.';
        return res.redirect('/auth/login');
      }
      // So sánh mật khẩu
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        req.session.errorPassword = 'Sai mật khẩu. Vui lòng thử lại.';
        return res.redirect('/auth/login');
      }else {
      // Lưu thông tin người dùng vào phiên làm việc
      req.session.userId = user._id;
      req.session.name = user.name;
      req.session.imgid = user.imgid;
      req.session.isVerifiedbyInstructor = user.isVerifiedbyInstructor;
      const myId = user._id;

      if (user.role == 'admin') {
        req.session.admin = true;
        // console.log('admin')
      }  else if (user.role == 'lecturer'){
        req.session.lecturer = true;
      } else {
        req.session.student = true;
        const group = await Group.findOne({ members: { $in: [myId] } });
        const instructor = await Instructor.findOne({ studentsId: { $in: [myId] } })
        if (group) {
          req.session.group = true;
        }
        if (instructor) {
          req.session.instructor = true;
        }
      }
      // console.log( req.session.group, req.session.instructor)
      // console.log(user.role)
      // console.log("admin: "+req.session.admin,"lecturer: "+req.session.lecturer,"student: "+req.session.student)
      res.redirect('/');
      }
    } catch (error) {
      res.json({
        err : error.message
      });
    }
  };
  //[GET] /auth/modify
  async viewmodify (req, res,next) {
    const myId = req.session.userId
    const existingClass = await UserClass.findOne({ members: { $in: [myId] } });
    var nameclass = '';
    if (existingClass) {
      nameclass = existingClass.name;
    }

    await User.findById(myId)
      .then((user) =>{
          res.render('auth/auth-modify_user', {
              user: mongooseToObject(user),
              nameclass,
              hideHeader : true,
              title:'Thông tin cá nhân'
          })
        })
      .catch(next);
  }
  //[put] /auth/modify
  async modify(req, res, next) {
    const { classuser,name, email,imgid,proficiency } = req.body;
    const myId = req.session.userId
    const existingClass = await UserClass.findOne({ members: { $in: [myId] } });
    const userclass = await UserClass.findOne({ name:classuser }); 
    var imgfile;
    try {
     imgfile = req.file.path;
    } catch (error) {
      console.log('không có ảnh trong quá trình gửi file')
    }
    var fileId;
    if (imgfile){
      await deletafile(imgid)
      let imgname; // Khai báo biến imgname trước khi sử dụng
      const atIndex = email.indexOf("@"); // Tìm chỉ mục của dấu @ trong chuỗi email
      if (atIndex !== -1) {
        imgname = email.slice(0, atIndex); // Gán giá trị cho biến imgname
      } else {
        imgname = name; // Gán giá trị cho biến imgname
      }
      fileId = await uploadfile(imgname,imgfile);
      fs.unlink(imgfile, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    if (fileId) {
      // 
      req.session.imgid = fileId;
      if (existingClass){
        if (existingClass.name == classuser) {
          res.redirect('/');
        } else {
          if (classuser){
            existingClass.members.pull(myId)
            existingClass.save()
                    .then(() => {
                      userclass.members.push(myId);
                      userclass.save()
                              .then((userclasss) => {
                                User.updateOne({ _id: myId }, { $set: { name, email,imgid:fileId,proficiency} })
                                    .then(() => {res.redirect('/')})
                                    .catch(err => {
                                      console.log(err);
                                      res.redirect('/');
                                    })
                              })
                              .catch(err => {
                                console.log(err);
                                res.redirect('/');
                              })
                    })
                    .catch(err => {
                      console.log(err);
                      res.redirect('/');
                    })
          } else{
            User.updateOne({ _id: myId }, { $set: { name, email,imgid:fileId,proficiency} })
            .then(() => {res.redirect('/')})
            .catch(err => {
              console.log(err);
              res.redirect('/');
            })
          }

        }
      } else {
        if (userclass) {
          userclass.members.push(myId);
          userclass.save()
                  .then((userclasss) => {
                    User.updateOne({ _id: myId }, { $set: { name, email,imgid:fileId,proficiency,isVerifiedbyInstructor:0} })
                    .then(() => {
                      req.session.isVerifiedbyInstructor = 0;
                      res.redirect('/');
                    })
                    .catch(err => {
                      console.log(err);
                      res.redirect('/');
                    })
                  })
                  .catch(err => res.redirect('/'))
        } else {
          User.updateOne({ _id: myId }, { $set: { name, email,imgid:fileId,proficiency} })
                    .then(() => {
                      res.redirect('/');
                    })
                    .catch(err => {
                      console.log(err);
                      res.redirect('/');
                    })
        }
      }
    } else {
      if (existingClass){
        if (existingClass.name == classuser) {
          res.redirect('/');
        } else {
          if (classuser){
            existingClass.members.pull(myId)
            existingClass.save()
                    .then(() => {
                      userclass.members.push(myId);
                      userclass.save()
                              .then((userclasss) => {
                                User.updateOne({ _id: myId }, { $set: { name, email,proficiency} })
                                    .then(() => {res.redirect('/')})
                                    .catch(err => {
                                      console.log(err);
                                      res.redirect('/');
                                    })
                              })
                              .catch(err => {
                                console.log(err);
                                res.redirect('/');
                              })
                    })
                    .catch(err => {
                      console.log(err);
                      res.redirect('/');
                    })
          } else{
            User.updateOne({ _id: myId }, { $set: { name, email,proficiency} })
            .then(() => {res.redirect('/')})
            .catch(err => {
              console.log(err);
              res.redirect('/');
            })
          }

        }
      } else {
        if (userclass) {
          userclass.members.push(myId);
          userclass.save()
                  .then((userclasss) => {
                    User.updateOne({ _id: myId }, { $set: { name, email,proficiency,isVerifiedbyInstructor:0} })
                    .then(() => {
                      req.session.isVerifiedbyInstructor = 0;
                      res.redirect('/');
                    })
                    .catch(err => {
                      console.log(err);
                      res.redirect('/');
                    })
                  })
                  .catch(err => res.redirect('/'))
        } else {
          User.updateOne({ _id: myId }, { $set: { name, email,proficiency} })
                    .then(() => {
                      res.redirect('/');
                    })
                    .catch(err => {
                      console.log(err);
                      res.redirect('/');
                    })
        }
      }
    }
  }

  async changepassword(req, res, next) {
    const { passwordold, passwordnew } = req.body;
    const myId = req.session.userId;
    try {
      const user = await User.findOne({_id:myId});
      // console.log(user);
      if (!user) {
        return res.redirect('/auth/login');
      }
      // So sánh mật khẩu
      const isPasswordCorrect = await bcrypt.compare(passwordold, user.password);
      if (!isPasswordCorrect) {
        req.session.errorPassword = 'Sai mật khẩu. Vui lòng thử lại.';
        return res.redirect('back');
      }else {
        const newPassword = await bcrypt.hash(passwordnew, 10) 
        await User.update({_id:myId}, { $set: {password:newPassword }})
        .then(() => {
          res.redirect('/');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/');
        })
      }
    } catch (error) {
      res.json({
        err : error.message
      });
    }
    // console.log(passwordold, passwordnew)
    // res.redirect('back')
  }
  viewchangepassword(req, res, next) {
    const errorPassword = req.session.errorPassword;
    delete req.session.errorPassword;
    res.render('auth/changepassword',{
      title:'Login',
      errorP:errorPassword
    });
  }
  //[post] /auth/logout
  logout (req, res) {
    // Xóa thông tin người dùng khỏi phiên làm việc
    req.session.destroy();
    res.redirect('/');
  };
}
module.exports = new authController();