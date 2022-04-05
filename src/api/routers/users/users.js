const router = require('express').Router();
const help = require('nodemon/lib/help');
const { HttpGetUser } = require('../../../controllers/users/user');

//protected routes
// all these will be implemented soon
console.log(HttpGetUser);
router.get('/user', HttpGetUser);
// router.route('/user').get(HttpGetUser).patch();
router.get('/users');
router.get('/me');

module.exports = router;
