const express = require('express');
const router = express.Router();
const homeMiddleware = require('../app/middlewares/homeMiddleware');
const siteController = require('../app/controllers/siteControllers');


router.get('/home',homeMiddleware, siteController.index);
router.get('/',homeMiddleware, siteController.index);

module.exports = router;
