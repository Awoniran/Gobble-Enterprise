const router = require('express').Router();
const {
  HttpAddProduct,
  HttpGetAllProducts,
  HttpGetProduct,
  HttpEditProduct,
  HttpDeleteProduct,
  HttpSearchProduct,
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
  .delete(HttpProtectRoute, HttpRestrictedTo('ADMIN'), HttpDeleteProduct)
  .patch(HttpProtectRoute, HttpRestrictedTo('ADMIN'), HttpEditProduct)
  .get(HttpGetProduct);

router.post('/queryProducts', HttpSearchProduct);
// console.log(router);

module.exports = router;
