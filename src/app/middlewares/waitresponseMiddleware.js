const responseMiddleware = (req, res, next) => {
    if ((req.session.instructor && req.session.isVerifiedbyInstructor == 0) || (req.session.group && req.session.isVerifiedbyInstructor == 1)) {
        next()
    } else {
       res.redirect('/') 
    }
}

module.exports = responseMiddleware;