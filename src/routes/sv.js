// routes/auth.js
const express = require('express');
const router = express.Router();
const svController = require('../app/controllers/svController');
const sv_instructorMiddleware = require('../app/middlewares/sv_instructorMiddleware');
const sv_groupMiddleware = require('../app/middlewares/sv_groupMiddleware');
const sv_beginMiddleware = require('../app/middlewares/sv_beginMiddleware');
const waitresponseMiddleware = require('../app/middlewares/waitresponseMiddleware')
const waitmodifyMiddleware = require('../app/middlewares/waitmodifyMiddleware')

router.get('/nhantin',sv_beginMiddleware, svController.viewnhantin);
router.get('/nhiemvu',sv_beginMiddleware, svController.viewnhiemvu);
router.put('/:id/completetask',sv_beginMiddleware,svController.completetask);

router.post('/:id/johngroup',sv_groupMiddleware,svController.johngroup);
router.get('/doan',sv_groupMiddleware, svController.viewdoan);

router.post('/:id/johninstructor',sv_instructorMiddleware,svController.johninstructor);
router.get('/giangvien',sv_instructorMiddleware, svController.viewgiangvien);

router.get('/waitresponse',waitresponseMiddleware, svController.viewwaitresponse);
router.get('/waitmodify',waitmodifyMiddleware, svController.viewwaitmodify);

module.exports = router;