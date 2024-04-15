const authMiddleware = (req, res, next) => {
    if (req.session.lecturer) {
        next()
    } else {
       res.redirect('back') 
    }
}

module.exports = authMiddleware;