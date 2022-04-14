const router = require('express').Router({ mergeParams: true });

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
const {
  upload,
  resizeUserPhoto,
} = require('../../../helpers/uploads/fileUpload');

router.route('/user/:id').get(HttpProtectRoute, HttpGetUser);
router.patch(
  '/user/editProfile',
  HttpProtectRoute,
  upload.single('image'),
  resizeUserPhoto,
  HttpUpdateUser
);
router.get(
  '/users',
  HttpProtectRoute,
  HttpRestrictedTo('ADMIN'),
  HttpGetAllUser
);
router.get('/me', HttpProtectRoute, HttpGetMe);

//a route for the super user/admin to make a user an admin by the user's gmail
router.patch(
  '/user/makeAdmin',
  HttpProtectRoute,
  HttpRestrictedTo('ADMIN'),
  HttpMakeAdmin
);
// to update the active on the user profile to false
router.patch(
  '/user/deleteAccount',
  HttpProtectRoute,
  HttpRestrictedTo('USER', 'ADMIN'),
  HttpDeleteAccount
);

module.exports = router;
