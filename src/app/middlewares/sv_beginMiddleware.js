const sv_beginMiddleware = (req, res, next) => {
    if (req.session.isVerifiedbyInstructor == 2) {
        next()
    } else {
        res.redirect('/')
    }
}
module.exports = sv_beginMiddleware;