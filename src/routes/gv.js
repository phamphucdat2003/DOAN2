// routes/auth.js
const express = require('express');
const router = express.Router();
const gvController = require('../app/controllers/gvController');

router.get('/diem',gvController.viewdiem);
router.post('/:groupId/:scores/diem',gvController.diem);


router.get('/nhiemvu',gvController.viewnhiemvu);
router.put('/:taskId/verifytask',gvController.verifytask);
router.put('/:taskId/deletetask',gvController.deletetask);
// router.get('/nhantin',gvController.viewnhantin);


router.get('/yeucau',gvController.viewyeucau);
router.put('/:studentId/acceptinstructor',gvController.acceptinstructor);
router.put('/:studentId/refuseinstructor',gvController.refuseinstructor);
router.delete('/:Id/refusevotecomplete',gvController.refusevotecomplete);
router.put('/:Id/acceptvotecomplete',gvController.acceptvotecomplete);
router.put('/:studentId/acceptgroup',gvController.acceptgroup);
router.put('/:studentId/:projectId/refusegroup',gvController.refusegroup);


router.get('/nhom',gvController.viewnhom);
router.put('/:studentId/:projectId/kickgroup',gvController.kickgroup);
router.post('/addtask', gvController.addtask);
router.get('/history_nhiemvu',gvController.historynhiemvu);



router.get('/sinhvien',gvController.viewsinhvien);
router.put('/:studentId/kickinstructor',gvController.kickinstructor);


router.put('/:id/edit-project',gvController.updateproject);
router.get('/:id/edit-project', gvController.editproject);
router.delete('/:id/forcedelete',gvController.forcedelete);
router.post('/create_doan', gvController.createdoan);
router.get('/create_doan', gvController.viewcreatedoan);
router.get('/doan', gvController.viewdoan);


module.exports = router;