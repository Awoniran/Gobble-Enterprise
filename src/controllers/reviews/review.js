const { PrismaClient } = require('@prisma/client');
const response = require('../../utils/res/response');
const { reviews, product } = new PrismaClient();
const AppError = require('../../utils/AppError/appError');
const { dumbReview } = require('../../utils/helpers');

async function productExist(id) {
   return await product.findFirst({ where: { id } });
}

async function addReview(req, res, next) {
   try {
      if (!(await productExist(+req.params.id)))
         return next(
            new AppError(
               'product to review is not defined, ensure the id point to a product',
               404
            )
         );
      req.body.userId = req.user.id;
      req.body.productId = +req.params.id;
      const newReview = await reviews.create({ data: req.body });
      response(res, 200, newReview);
   } catch (err) {
      return next(new AppError('An error ocurred, kindly try again', 500));
   }
}

async function getReviews(req, res, next) {
   try {
      let reviews = await reviews.findMany({
         where: { productId: +req.params.id },
         include: { User: true },
      });
      reviews = reviews.map((review) => dumbReview(review));
      response(res, 200, reviews);
   } catch (err) {
      return next(new AppError('An error ocurred, kindly try again', 500));
   }
}

module.exports = {
   addReview,
   getReviews,
};
