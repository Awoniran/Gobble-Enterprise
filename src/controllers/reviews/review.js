const { PrismaClient } = require('@prisma/client');
const response = require('../../utils/res/response');
const { reviews, product } = new PrismaClient();
const AppError = require('../../utils/AppError/appError');
const { query_timeout } = require('pg/lib/defaults');

async function productExist(id) {
  return await product.findFirst({ where: { id } });
}

// async function preventDuplicateReview(userId, reviewID) {
//   const query = await product.findFirst({ where: { id: reviewID } });
//   if (!(query.userId === userId)) {
//     return next(new AppError('you already review this product', 400));
//   }
// }

async function addReview(req, res, next) {
  try {
    if (!(await productExist(+req.params.id)))
      return next(
        new AppError(
          'product to review is not defined, ensure the id point to a product',
          404
        )
      );
    // console.log(await productExist(+req.params.id));
    // function to prevent duplicate reviews
    // await preventDuplicateReview(+req.params.id, +req.user.id);

    req.body.userId = req.user.id;
    req.body.productId = +req.params.id;
    const newReview = await reviews.create({ data: req.body });
    response(res, 200, newReview);
  } catch (err) {
    console.log(err.message);
    return next(new AppError('An error ocurred, kindly try again', 500));
  }
}

async function getReviews(req, res, next) {
  try {
    const Reviews = await reviews.findMany({
      where: { productId: +req.params.id },
      include: { User: true },
    });
    response(res, 200, Reviews);
  } catch (err) {
    console.log(err.message);
    return next(new AppError('An error ocurred, kindly try again', 500));
  }
}

module.exports = {
  addReview,
  getReviews,
};
