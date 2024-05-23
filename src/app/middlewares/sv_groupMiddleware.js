
async function sv_groupMiddleware(req, res, next) {
    if ((req.session.isVerifiedbyInstructor == 1) && !req.session.group) {
        next();
    } else {
        res.redirect('/');
    }
}

module.exports = sv_groupMiddleware;
