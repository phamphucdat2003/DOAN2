const authMiddleware = (req, res, next) => {
    if (req.session.student) {
        next()
    } else {
       res.redirect('back') 
    }
}

module.exports = authMiddleware;