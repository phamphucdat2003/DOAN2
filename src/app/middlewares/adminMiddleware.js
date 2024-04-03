const adminMiddleware = (req, res, next) => {
  if (req.session.admin) {
    // Người dùng đã đăng nhập, cho phép truy cập vào router tiếp theo
    next();
  } else {
    // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
    res.redirect('/auth/login');
  }
};

module.exports = adminMiddleware;