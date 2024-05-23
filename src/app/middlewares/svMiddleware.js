
const svMiddleware = (req, res, next) => {
    if (req.session.student) {
        next()
    } else {
       res.redirect('/') 
    }
}

module.exports = svMiddleware;