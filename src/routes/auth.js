// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/authController');
const uploadMiddleware = require('../app/middlewares/uploadMiddleware');
const authMiddleware = require('../app/middlewares/authMiddleware');


router.put('/modify',uploadMiddleware, authController.modify);
router.get('/modify',authMiddleware,authController.viewmodify);

router.put('/changepassword',authMiddleware, authController.changepassword);
router.get('/changepassword',authMiddleware,authController.viewchangepassword);


router.get('/register', authController.viewregister);
router.post('/register',uploadMiddleware, authController.register);
router.get('/login', authController.viewlogin);
router.post('/login', authController.login);
router.post('/logout',authMiddleware,authController.logout);

module.exports = router;