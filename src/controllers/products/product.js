const { PrismaClient } = require('@prisma/client');
const read = require('body-parser/lib/read');
const AppError = require('../../utils/AppError/appError');
const response = require('../../utils/res/response');
const slug = require('slugify');
const { product, reviews } = new PrismaClient();

function slugify(name) {
   return slug(name, '_', { lower: true });
}

async function averageReview() {
   const Reviews = await reviews.findMany();
}

async function existingProduct(name) {
   return await product.findUnique({ where: { name } });
}

async function productExist(id) {
   return await product.findUnique({ where: { id } });
}

async function HttpGetAllProducts(req, res, next) {
   try {
      const getProducts = await product.findMany();
      if (!getProducts) return next(new AppError('no product found', 404));
      response(res, 200, getProducts);
   } catch (err) {
      return next(
         new AppError('opps!!! something went wrong, try again ', 500)
      );
   }
}

async function HttpGetProduct(req, res, next) {
   try {
      if (!(await productExist(+req.params.productId)))
         return next(new AppError('no product found', 404));
      const getProduct = await product.findFirst({
         where: { id: +req.params.productId },
         include: { Reviews: true },
      });
      response(res, 200, getProduct);
   } catch (err) {
      const message = err.message.split('id: ')[2];
      return next(new AppError(`kindly try again, ${message}`, 500));
   }
}

async function HttpAddProduct(req, res, next) {
   try {
      const { name, description, price, image, category, averageReview } =
         req.body;
      req.body.slug = slugify(name);
      if (await existingProduct(name))
         return next(new AppError('product already exist', 400));
      const newProduct = await product.create({
         data: req.body,
      });
      response(res, 200, newProduct);
   } catch (err) {
      return next(
         new AppError('opps!! kindly try again, something went wrong', 500)
      );
   }
}

async function HttpDeleteProduct(req, res, next) {
   try {
      if (!(await productExist(+req.params.productId)))
         return next(new AppError('no product found', 404));
      const query = await product.delete({
         where: { id: +req.params.productId },
      });
      response(res, 200, 'success');
   } catch (err) {
      return next(new AppError(`kindly try again, ${err.message}`, 500));
   }
}

async function HttpEditProduct(req, res, next) {
   try {
      if (!(await productExist(+req.params.productId)))
         return next(new AppError('no product found', 404));
      if (req.file) {
         req.body.image = req.file.filename;
      }
      const query = await product.update({
         where: { id: +req.params.productId },
         data: req.body,
      });
      response(res, 200, query);
   } catch (err) {
      const message = err.message.split('id: ')[2];
      return next(new AppError(`kindly try again, ${message}`, 500));
   }
}

function checkName(query, reqQuery) {
   return query.map((product) => {
      if (product.name.includes(reqQuery.trim())) {
         return product;
      }
   });
}

async function HttpSearchProduct(req, res, next) {
   try {
      const products = await product.findMany();
      const searchResults = checkName(products, req.body.query);
      response(res, 200, searchResults);
   } catch (err) {
      return next(
         new AppError('something went very wrong, kindly try again', 500)
      );
   }
}

module.exports = {
   HttpAddProduct,
   HttpGetProduct,
   HttpEditProduct,
   HttpDeleteProduct,
   HttpSearchProduct,
   HttpGetAllProducts,
};
