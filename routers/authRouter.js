const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { tokenIdentification } = require('../middlewares/tokenIndentification');

router.get('/getallusers', authController.getallUsers);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', tokenIdentification, authController.logout)

router.patch('/sendverification', tokenIdentification, authController.sendVerificationToken)
router.patch('/verifyverification', tokenIdentification, authController.verifyVerificationCode)
router.patch('/changepassword', tokenIdentification, authController.changePassword)

module.exports = router;