 const homeMiddleware = (req, res, next) => {
 
    if (req.session.admin) {
      res.redirect('/admin');
    } else if (req.session.lecturer){
      res.redirect('/gv');
    } else if (req.session.student) {
      res.redirect('/sv');
    } else {
      next()
    }
};
  
  module.exports = homeMiddleware;