// routes/auth.js
const express = require('express');
const router = express.Router();
const svController = require('../app/controllers/svController');
const sv_groupMiddleware = require('../app/middlewares/sv_groupMiddleware');
const sv_groupMiddleware2 = require('../app/middlewares/sv_groupMiddleware2');
// const homeMiddleware = require('../app/middlewares/homeMiddleware');


router.get('/nhantin', svController.viewnhantin);
router.get('/yeucau', svController.viewyeucau);

router.post('/:id/john',svController.johngroup);

router.get('/doan',sv_groupMiddleware2, svController.viewdoan);
router.get('/',sv_groupMiddleware, svController.viewdoan);

module.exports = router;