
async function sv_instructorMiddleware(req, res, next) {
    if ((req.session.isVerifiedbyInstructor == 0) && !req.session.instructor) {
        next();
    } else {
        res.redirect('/');
    }
}

module.exports = sv_instructorMiddleware;
