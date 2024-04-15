// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/authController');
const uploadMiddleware = require('../app/middlewares/uploadMiddleware');
const authMiddleware = require('../app/middlewares/authMiddleware');



router.get('/register', authController.viewregister);
router.post('/registerFake',uploadMiddleware, authController.registerFake);
router.get('/login', authController.viewlogin);
router.post('/login', authController.login);
router.post('/logout',authMiddleware,authController.logout);

module.exports = router;