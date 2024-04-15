// controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../models/User');
const UserFake = require('../models/Userfake');
const Group = require('../models/Group');
const fs = require('fs');
const { uploadfile } = require('../api/googleDriveAPI');



class authController {
  //[post] /auth/registerFake
  async registerFake(req, res) {
    try {
      const { name, email, password } = req.body;
      console.log(name, email, password);
      const imgfile = req.file.path;
      const imgname = req.file.originalname; 
      const existingUser = await User.findOne({email});
      console.log(existingUser)
      if (existingUser) {
        fs.unlink(imgfile, (err) => {
          if (err) {
            console.log(err);
          }
        });
      return res.render('auth/register',{title:'register',overlay:true});
      } else {
        const existingUserFake = await UserFake.findOne({email});
        if (existingUserFake) {
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
              const userFake = new UserFake({
                name,
                email,
                password:hashedPassword,
                imgid:fileId
              });
              await userFake.save();
        
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
  //[get] /auth/register
  viewregister (req, res) {
        res.render('auth/register',{title:'Register',overlay:false});
    };
  
  //[post] /auth/login
  async login (req, res) {
    const { email, password } = req.body;
    try {
      // Tìm người dùng trong cơ sở dữ liệu
      // console.log(email,password);
      const user = await User.findOne({ email });
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
      const userId = user._id;
      const group = await Group.findOne({ members: userId });
      console.log(group)
      if (group) {
        req.session.group = true;
      }
      // console.log(req.session.group);
      // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
      if (user.role == 'admin') {
        req.session.admin = true;
        // console.log('admin')
      }  else if (user.role == 'lecturer'){
        req.session.lecturer = true;
        // console.log('lec')
      } else {
        req.session.student = true;
        // console.log('student')
      }
      res.redirect('/');
      }
    } catch (error) {
      res.json({
        err : error.message
      });
    }
  };

  //[post] /auth/logout
  logout = (req, res) => {
    // Xóa thông tin người dùng khỏi phiên làm việc
    req.session.destroy();
    res.redirect('/');
  };
}
module.exports = new authController();