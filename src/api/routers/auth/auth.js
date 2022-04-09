const router = require('express').Router();
const {
  HttpSignUp,
  HttpLogin,
  HttpForgotPassword,
  HttpResetPassword,
} = require('../../../controllers/auth/authController');

router.post('/auth/signup', HttpSignUp);
router.post('/auth/login', HttpLogin);
router.post('/forgotPassword', HttpForgotPassword);
router.post('/resetPassword', HttpResetPassword);

module.exports = router;
