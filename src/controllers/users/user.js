const { PrismaClient } = require('@prisma/client');
const AppError = require('../../utils/AppError/appError');
const response = require('../../utils/res/response');
const { user } = new PrismaClient();
const Email = require('../../utils/email/email');

const selectOptions = {
   id: true,
   name: true,
   role: true,
   role: true,
   email: true,
   image: true,
   active: true,
   orders: true,
   address: true,
   createdAt: true,
};

async function existingUser(email) {
   return await user.findFirst({ where: { email, active: true } });
}

async function HttpGetUser(req, res, next) {
   try {
      const User = await user.findFirst({
         where: { id: +req.params.id, active: true },
         include: {
            cart: true,
            orders: true,
         },
      });
      if (!User)
         return next(
            new AppError('user not found, kindly entered a valid id', 404)
         );
      return response(res, 200, User);
   } catch (err) {
      console.log(err.name);
      return next(new AppError(`kindly try again, ${err.message}`, 400));
   }
}

async function HttpGetAllUser(req, res, next) {
   try {
      const { limit, page } = req.query;
      const users = await user.findMany({
         take: +limit,
         skip: (page - 1) * limit,
         where: { active: true },
         select: selectOptions,
         orderBy: { createdAt: 'desc' },
      });
      if (!users) return next(new AppError('no user found', 500));
      return response(res, 200, users);
   } catch (err) {
      return next(new AppError(`kindly try again, ${err.message}`, 500));
   }
}

async function HttpGetMe(req, res, next) {
   try {
      const currentUser = await user.findFirst({
         where: {
            id: +req.user.id,
         },
         select: selectOptions,
      });
      if (!currentUser)
         return next(new AppError('kindly login to access this route', 401));
      response(res, 200, currentUser);
   } catch (err) {
      // console.log(err.stack);
      return next(new AppError('kindly try again', 400));
   }
}

async function HttpMakeAdmin(req, res, next) {
   try {
      const { email } = req.body;
      if (!email)
         return next(new AppError('kindly provide the user email', 400));
      if (!(await existingUser(email)))
         return next(new AppError('the user does not exist', 404));
      const updatedUser = await user.update({
         where: { email },
         data: { role: 'ADMIN' },
      });
      const message = `${updatedUser.name.split(' ')[0]} is now an admin`;
      response(res, 200, message);
   } catch (err) {
      return next(new AppError(`kindly try again ${err.message}`, 500));
   }
}

async function HttpDeleteAccount(req, res, next) {
   try {
      const deleteUser = await user.update({
         where: { id: req.user.id },
         data: { active: false },
      });
      response(res, 204);
   } catch (err) {
      console.log(err.message);
      return next(new AppError('An error ocurred, kindly try again', 500));
   }
}

async function HttpUpdateUser(req, res, next) {
   try {
      const { email, role, password } = req.body;
      if (email || role || password)
         return next(
            new AppError(
               `can't update role, email and password on this route`,
               400
            )
         );
      if (req.file) {
         req.body.image = req.file.filename;
      }
      const loggedInUser = await user.update({
         where: { id: +req.user.id },
         data: req.body,
      });
      response(res, 200, loggedInUser);
   } catch (err) {
      return next(new AppError(`kindly try again!!! ${err.message}`, 500));
   }
}

module.exports = {
   HttpGetMe,
   HttpGetUser,
   HttpMakeAdmin,
   HttpGetAllUser,
   HttpUpdateUser,
   HttpDeleteAccount,
};
