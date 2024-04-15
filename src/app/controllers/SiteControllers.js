//chay cai mongodb
const { mutipleMongooseToObject } = require('../../util/mongoose');
//----------------------------------------------------------------
class SiteController {
    //[GET] /home
    index(req, res) {
        res.render('site/home',{title:'HỆ THỐNG QUẢN LÝ ĐỒ ÁN'})
    }
}
module.exports = new SiteController();
