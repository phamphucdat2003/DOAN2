
const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/adminController');

router.get('/:id/edit-user', adminController.edituser);
router.delete('/:id/forcedelete',adminController.forcedelete);
router.delete('/f/:id/forcedelete',adminController.deleteuserfake);
router.put('/:id',adminController.update);

router.get('/qltk', adminController.viewqltk);

router.post('/registerTrue', adminController.registerTrue);
router.get('/duyet', adminController.viewduyet);
router.get('/', adminController.viewduyet);


module.exports = router;