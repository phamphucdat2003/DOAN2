// routes/auth.js
const express = require('express');
const router = express.Router();
const gvController = require('../app/controllers/gvController');




router.put('/:id',gvController.update);
router.get('/:id/edit-project', gvController.editproject);
router.delete('/:id/forcedelete',gvController.forcedelete);
router.post('/create_doan', gvController.createdoan);
router.get('/create_doan', gvController.viewcreatedoan);
router.get('/doan', gvController.viewdoan);
router.get('/', gvController.viewdoan);


module.exports = router;