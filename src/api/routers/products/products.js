const router = require('express').Router();
const {
  HttpAddProduct,
  HttpGetAllProducts,
  HttpGetProduct,
  HttpEditProduct,
  HttpDeleteProduct,
} = require('../../../controllers/products/product');
const {
  HttpProtectRoute,
  HttpRestrictedTo,
} = require('../../../controllers/auth/authController');

router
  .route('/products')
  .post(HttpProtectRoute, HttpRestrictedTo('ADMIN'), HttpAddProduct)
  .get(HttpGetAllProducts);

router
  .route('/products/:id')
  .delete(HttpDeleteProduct)
  .patch(HttpEditProduct)
  .get(HttpGetProduct);

router.post('/queryProduct');

module.exports = router;
