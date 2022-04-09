const router = require('express').Router();
const {
  HttpAddProduct,
  HttpGetAllProducts,
  HttpGetProduct,
} = require('../../../controllers/products/product');
const {
  HttpProtectRoute,
  HttpRestrictedTo,
} = require('../../../controllers/auth/authController');

router.get('/getallproducts', HttpGetAllProducts);
router
  .route('/product')
  .get(HttpGetProduct)
  .post(HttpProtectRoute, HttpRestrictedTo('ADMIN'), HttpAddProduct)
  .delete()
  .patch();

module.exports = router;
