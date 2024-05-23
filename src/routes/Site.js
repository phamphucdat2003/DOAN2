const express = require('express');
const router = express.Router();
const homeMiddleware = require('../app/middlewares/homeMiddleware');
const siteController = require('../app/controllers/siteController');

router.get('/404', siteController.error1);
router.get('/home',homeMiddleware, siteController.index);
router.get('/',homeMiddleware, siteController.index);

module.exports = router;
