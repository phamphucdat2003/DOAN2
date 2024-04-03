const godcatMiddleware = (req, res, next) => {
    if (req.session.godcat) {
      // Người dùng đã đăng nhập, cho phép truy cập vào router tiếp theo
      next();
    } else {
      // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
      res.render('site/godcat');
    }
  };
  
  module.exports = godcatMiddleware;