
const express = require('express');
const router = express.Router();
const messageController = require('../app/controllers/messageController');


router.get('/nhantin',messageController.viewnhantin);
router.get('/nhantin/:id',messageController.nhantin1);
router.get('/nhantin/:id/group',messageController.nhantin2);

router.post('/sendvotemessage', messageController.sendvotemessage);
router.post('/sendmessage', messageController.sendmessage);


module.exports = router;