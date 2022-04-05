const router = require('express').Router();

router.post('/auth/signup');
router.post('/auth/login');

router.post('/forgotPassword');
router.post('/resetPassword');

module.exports = router;
