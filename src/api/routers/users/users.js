const router = require('express').Router({ mergeParams: true });

const {
   HttpGetUser,
   HttpGetAllUser,
   HttpGetMe,
   HttpMakeAdmin,
   HttpDeleteAccount,
   HttpRemoveUser,
   HttpUpdateUser,
} = require('../../../controllers/users/user');

const {
   HttpProtectRoute,
   HttpRestrictedTo,
} = require('../../../controllers/auth/authController');

const { upload, resizePhoto } = require('../../../helpers/uploads/fileUpload');

const { upLoad } = require('../../../helpers/uploads/aws/aws_sdk');

router
   .route('/user/:id')
   .get(HttpProtectRoute, HttpRestrictedTo('ADMIN'), HttpGetUser)
   .delete(HttpProtectRoute, HttpRestrictedTo('ADMIN'), HttpRemoveUser);

//edit users data and upload of pictures
router.patch(
   '/user/editProfile',
   HttpProtectRoute,
   upload.single('image'),
   resizePhoto('users'),
   HttpUpdateUser
);

router.get('/uploads', HttpProtectRoute, upLoad);

//route to get all active users
router.get(
   '/users',
   HttpProtectRoute,
   HttpRestrictedTo('ADMIN'),
   HttpGetAllUser
);
// to get the user profile
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
