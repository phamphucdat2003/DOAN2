//chay cai mongodb
const { mutipleMongooseToObject } = require('../../util/mongoose');
//----------------------------------------------------------------
class SiteController {
    error1(req, res, next) {
        res.render('error/404',{
            title:'LỖI HỆ THỐNG',
            home:true
        });
    }
    //[GET] /home
    index(req, res) {
        res.render('site/home',{
            title:'HỆ THỐNG QUẢN LÝ ĐỒ ÁN',
            home:true
        });
    }
}
module.exports = new SiteController();
