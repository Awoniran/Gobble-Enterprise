"use strict";

var router = require('express').Router();

router.get('/getallproducts');
router.route('/product').get().post()["delete"]();
module.exports = router;