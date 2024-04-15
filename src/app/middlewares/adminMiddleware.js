const authMiddleware = (req, res, next) => {
    if (req.session.admin) {
        next()
    } else {
       res.redirect('back') 
    }
}

module.exports = authMiddleware;