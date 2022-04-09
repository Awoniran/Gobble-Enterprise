const { PrismaClient } = require('@prisma/client');
const read = require('body-parser/lib/read');
const AppError = require('../../utils/AppError/appError');
const response = require('../../utils/res/response');
const { product } = new PrismaClient();

async function existingProduct(name) {
  return await product.findUnique({ where: { name } });
}

async function HttpGetAllProducts(req, res, next) {
  try {
    if (!products) return next(new AppError('no product found', 404));
    response(res, 200, 'success', products);
  } catch (err) {
    console.log(err.stack);
    return next(new AppError('opps!!! something went wrong, try again ', 500));
  }
}

async function HttpGetProduct(req, res, next) {
  try {
    const product = await product.findFirst({
      where: { name: /`${req.query.name}`/ },
    });
    // const product = await client.query(text, value);
    if (!product) return next(new AppError('no product found', 404));
    response(res, 200, 'success', product);
  } catch (err) {
    console.log(err.stack);
  }
}

async function HttpAddProduct(req, res, next) {
  try {
    const { name, description, price, image, category, averageReview } =
      req.body;
    if (await existingProduct(name))
      return next(new AppError('product already exist', 400));
    console.log(await existingProduct(name));

    if (
      !name ||
      !description ||
      !price ||
      !image ||
      !category ||
      !averageReview
    )
      return next(new AppError('missing required field(s)', 400));
    const newProduct = await product.create({
      data: req.body,
    });
    response(res, 200, 'success', newProduct);
  } catch (err) {
    console.log(err.stack);
    return next(
      new AppError('opps!! kindly try again, something went wrong', 500)
    );
  }
}

async function HttpDeleteProduct(req, res, next) {
  try {
  } catch (err) {
    console.log(err.stack);
  }
}
async function HttpEditProduct(req, res, next) {
  try {
  } catch (err) {
    console.log(err.stack);
  }
}
module.exports = {
  HttpAddProduct,
  HttpGetAllProducts,
  HttpGetProduct,
};
