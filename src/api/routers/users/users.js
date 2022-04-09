const router = require('express').Router();
const {
  HttpGetUser,
  HttpGetAllUser,
  HttpGetMe,
  HttpMakeAdmin,
  HttpDeleteAccount,
  HttpUpdateUser,
} = require('../../../controllers/users/user');
const {
  HttpProtectRoute,
  HttpRestrictedTo,
} = require('../../../controllers/auth/authController');

router.route('/user/:id').get(HttpProtectRoute, HttpGetUser);
router.patch('/user/editProfile', HttpProtectRoute, HttpUpdateUser);
router.get('/users', HttpProtectRoute, HttpGetAllUser);
router.get('/me', HttpProtectRoute, HttpGetMe);

//a route for the super user/admin to make a user an admin by the user's gmail
router.patch(
  '/user/makeAdmin',
  HttpProtectRoute,
  HttpRestrictedTo('ADMIN'),
  HttpMakeAdmin
);
router.patch(
  '/user/deleteAccount',
  HttpProtectRoute,
  HttpRestrictedTo('USER', 'ADMIN'),
  HttpDeleteAccount
);

module.exports = router;
