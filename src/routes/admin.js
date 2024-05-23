
const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/adminController');

router.get('/:id/edit-user', adminController.edituser);
router.delete('/:id/forcedelete',adminController.forcedelete);

router.post('/addclass',adminController.addclass);


router.put('/:id',adminController.update);
router.put('/:id',adminController.update);


router.get('/qltk', adminController.viewqltk);
router.put('/:userId/:role/verified',adminController.verified);
router.get('/duyet', adminController.viewduyet);
router.get('/', adminController.viewqltk);


module.exports = router;