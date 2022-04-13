const router = require('express').Router({ strict: true });
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
const {
  HttpAddProductToCart,
  HttpMyCart,
  HttpRemoveProductFromCart,
} = require('../../../controllers/cart/cart');

router
  .route('/products')
  .post(HttpProtectRoute, HttpRestrictedTo('ADMIN'), HttpAddProduct)
  .get(HttpGetAllProducts);

router
  .route('/products/:productId')
  .delete(HttpProtectRoute, HttpRestrictedTo('ADMIN'), HttpDeleteProduct)
  .patch(HttpProtectRoute, HttpRestrictedTo('ADMIN'), HttpEditProduct)
  .get(HttpGetProduct);

router.post('/queryProducts', HttpSearchProduct);

router
  .route('/products/cart/:productId')
  .delete(HttpProtectRoute, HttpRemoveProductFromCart)
  .post(HttpProtectRoute, HttpAddProductToCart);

router.post('/products/orders');
router.get('/mycart', HttpProtectRoute, HttpMyCart);

module.exports = router;
