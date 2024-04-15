const Group = require('../models/Group');

async function sv_groupMiddleware(req, res, next) {

    if (req.session.group) {
        res.redirect('yeucau');
    } else {
        next();
    }
}

module.exports = sv_groupMiddleware;
