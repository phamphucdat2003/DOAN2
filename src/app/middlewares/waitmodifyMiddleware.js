const responseMiddleware = (req, res, next) => {
    if (!req.session.group && !req.session.instructor && req.session.isVerifiedbyInstructor == 3) {
        next()
    } else {
       res.redirect('/') 
    }
}

module.exports = responseMiddleware;