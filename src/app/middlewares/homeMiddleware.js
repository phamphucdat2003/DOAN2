 const homeMiddleware = (req, res, next) => {
 
    if (req.session.admin) {
      res.redirect('/admin');
    } else if (req.session.lecturer){
      res.redirect('/gv/doan');
    } else if (req.session.student) {
        if (req.session.isVerifiedbyInstructor == 0) {
          console.log(req.session.instructor)
          if (req.session.instructor){
            res.redirect('/sv/waitresponse')
          } else {
            res.redirect('/sv/giangvien')
          }
        } else if (req.session.isVerifiedbyInstructor == 1) {
          if (req.session.group){
            res.redirect('/sv/waitresponse')
          } else {
            res.redirect('/sv/doan')
          }
        } else if (req.session.isVerifiedbyInstructor == 3){
          res.redirect('/sv/waitmodify')
        }else {
          res.redirect('/sv/nhiemvu')
        }

    } else {
      next()
    }
};
  
  module.exports = homeMiddleware;