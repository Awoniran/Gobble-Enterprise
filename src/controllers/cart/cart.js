const { PrismaClient } = require('@prisma/client');
const AppError = require('../../utils/AppError/appError');
const response = require('../../utils/res/response');
const { cart, product, user } = new PrismaClient();

async function productExist(id) {
   return await product.findFirst({
      where: { id },
   });
}

function calcTotalPrice(cartArray) {
   return cartArray.reduce((acc, product) => acc + product.totalPrice, 0);
}

async function HttMoveToOrder(req, res, next) {
   try {
   } catch (err) {
      return next(new AppError('something went very wrong', 500));
   }
}

async function HttpAddProductToCart(req, res, next) {
   try {
      const product = await productExist(+req.params.productId);
      if (!product)
         return next(
            new AppError(
               'product to add does not found, kindly ensure a valid id',
               404
            )
         );
      const cart_products = await cart.create({
         data: {
            userId: req.user.id,
            product: product.name,
            quantity: req.body.quantity,
            totalPrice: +req.body.quantity * product.price || product.price,
         },
      });
      response(res, 200, cart_products);
   } catch (err) {
      return next(new AppError(`An error occurred, kindly try again`, 500));
   }
}

async function HttpRemoveProductFromCart(req, res, next) {
   try {
      if (!(await cart.findUnique({ where: { id: +req.params.productId } })))
         return next(new AppError('product not found in cart', 404));
      const removeProduct = await cart.delete({
         where: { id: +req.params.productId },
      });
      response(res, 200, 'product removed from cart');
   } catch (err) {
      return next(new AppError('something went very wrong... try again', 500));
   }
}

async function HttpMyCart(req, res, next) {
   try {
      const myCart = await cart.findMany({ where: { userId: +req.user.id } });
      response(res, 200, myCart, calcTotalPrice(myCart));
   } catch (err) {
      return next(new AppError('kindly try again', 500));
   }
}

module.exports = {
   HttpMyCart,
   HttMoveToOrder,
   HttpAddProductToCart,
   HttpRemoveProductFromCart,
};
