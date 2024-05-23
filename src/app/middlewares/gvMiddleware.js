const authMiddleware = (req, res, next) => {
    if (req.session.lecturer) {
        next()
    } else {
       res.redirect('/') 
    }
}

module.exports = authMiddleware;