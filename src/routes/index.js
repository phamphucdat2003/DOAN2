const siteRouter = require('./site');
const authRouter = require('./auth');
const gvRouter = require('./gv');
const svRouter = require('./sv');
const adminRouter = require('./admin');
const authMiddleware = require('../app/middlewares/authMiddleware');
const adminMiddleware = require('../app/middlewares/adminMiddleware');
const svMiddleware = require('../app/middlewares/svMiddleware');
const gvMiddleware = require('../app/middlewares/gvMiddleware');
function route(app) {
    app.use('/gv',gvMiddleware,authMiddleware,gvRouter);
    app.use('/sv',svMiddleware,authMiddleware,svRouter);
    app.use('/admin',adminMiddleware,authMiddleware,adminRouter);
    app.use('/auth',authRouter);
    app.use('/',siteRouter);
}

module.exports = route;
    