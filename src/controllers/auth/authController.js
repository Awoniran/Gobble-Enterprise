const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const response = require('../../utils/res/response');
const AppError = require('../../utils/AppError/appError');
const { user } = new PrismaClient();
const Email = require('../../utils/email/email');

function signToken(id) {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
   });
}

async function existingUser(email) {
   return await user.findFirst({ where: { email, active: true } });
}

async function hashPassword(password) {
   return await bcrypt.hash(password, 10);
}

async function comparePassword(userPassword, password) {
   return await bcrypt.compare(userPassword, password);
}

function verifyToken(token) {
   return jwt.verify(token, process.env.JWT_SECRET);
}

async function HttpSignUp(req, res, next) {
   try {
      const { email, password, name, role } = req.body;
      if (!email || !password || !name)
         return next(
            new AppError(
               `${role}`
                  ? `you can't assign role, contact support`
                  : `missing required   field(s)`,
               400
            )
         );

      if (await existingUser(email))
         return next(
            new AppError('There is a user with the provided email', 409)
         );
      const newUser = await user.create({
         data: {
            email: req.body.email,
            name: req.body.name,
            password: await hashPassword(req.body.password),
            role: req.body.role,
         },
      });
      const url = `${req.protocol}://${req.get(
         'host'
      )}/api/v1/user/editProfile`;
      await new Email(newUser, url).sendWelcome();
      response(res, 200, 'Account created successfully', signToken(newUser.id));
   } catch (err) {
      console.log(err);
      if (err.code === 'ESOCKET' && err.port === 465)
         return next(new AppError('account created', 200));
      return next(
         new AppError(
            'oppss!!!, something went very wrong,kindly try again',
            500
         )
      );
   }
}

async function HttpLogin(req, res, next) {
   try {
      const { email, password } = req.body;
      if (!email || !password)
         return next(new AppError('provide your email and password', 401));
      const user = await existingUser(email);
      if (!user) return next(new AppError('invalid username of password', 404));
      if (!(await comparePassword(password, user.password))) {
         return next(new AppError('invalid username or password', 401));
      }
      const token = signToken(user.id);
      response(res, 200, undefined, token);
   } catch (err) {
      // console.log(err.stack);
      return next(
         new AppError('opps!!,something went wrong,kindly try again', 500)
      );
   }
}

async function HttpProtectRoute(req, res, next) {
   let token = undefined;
   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
   ) {
      token = req.headers.authorization.split(' ')[1];
   }
   console.log(token);
   if (!token)
      return next(
         new AppError('you are not logged in , kindly login to access', 401)
      );
   const payload = jwt.verify(token, process.env.JWT_SECRET);
   // console.log(payload);
   const currentUser = await user.findFirst({
      where: { id: payload.id, active: true },
   });
   if (!currentUser)
      return next(
         new AppError('there is no user with the provided token', 401)
      );
   req.user = currentUser;
   console.log(req.user);
   next();
}

function HttpRestrictedTo(...roles) {
   return (req, res, next) => {
      if (!roles.includes(req.user.role))
         return next(
            new AppError('you are not allowed to perform this operation', 403)
         );
      next();
   };
}

async function HttpUpdatePassword(req, res, next) {
   try {
      let { password, currentPassword, confirmPassword } = req.body;
      const User = await user.findFirst({ where: { id: req.user.id } });
      if (!(await comparePassword(currentPassword, User.password)))
         return next(new AppError('current password is not correct', 400));
      if (password !== confirmPassword)
         return next(new AppError('passwords not match', 400));
      req.body.password = await hashPassword(password);
      req.body.confirmPassword = undefined;
      req.body.currentPassword = undefined;
      await user.update({ where: { id: req.user.id }, data: req.body });
      response(res, 200, 'password updated successfully');
   } catch (err) {
      req.body = undefined;
      return next(
         new AppError('oppss!!!, an error occurred ,kindly try again', 500)
      );
   }
}

async function HttpResetPassword(req, res, next) {
   const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');
   const userExist = await user.findFirst({
      where: {
         passwordResetToken: hashedToken,
         passwordResetExpires: { gt: Date.now() },
      },
   });
   if (!userExist)
      return next(new AppError('token is invalid or expired', 400));
   const { password, passwordConfirm } = req.body;
   if (password !== passwordConfirm)
      return next(new AppError('password not match'));
   const updateUser = await user.update({
      where: { email: userExist.email },
      data: {
         passwordResetExpires: null,
         passwordResetToken: null,
         password: await hashPassword(req.body.password),
      },
   });
   console.log(updateUser);

   const jwt = signToken(userExist.id);
   response(res, 200, 'reset successful', jwt);
}

async function HttpForgotPassword(req, res, next) {
   if (!(await existingUser(req.body.email)))
      return next(new AppError('no user with the provided email address', 404));
   const randomBytes = crypto.randomBytes(32).toString('hex');
   const resetToken = crypto
      .createHash('sha256')
      .update(randomBytes)
      .digest('hex');
   req.body.passwordResetToken = resetToken;
   req.body.passwordResetExpires = Date.now() + 10 * 60 * 1000;
   const patchUser = await user.update({
      where: { email: req.body.email },
      data: req.body,
   });
   try {
      const resetUrl = `${req.protocol}://${req.get(
         'host'
      )}/api/v1/resetPassword/${randomBytes}`;
      await new Email(patchUser, resetUrl).sendPasswordReset();
      response(res, 200, 'token sent to email');
   } catch (err) {
      await user.update({
         where: { email: req.body.email },
         data: {
            passwordResetExpires: null,
            passwordResetToken: null,
         },
      });
      return next(
         new AppError('there was an error sending the email, try again', 500)
      );
   }
}

module.exports = {
   HttpLogin,
   HttpSignUp,
   HttpForgotPassword,
   HttpResetPassword,
   HttpProtectRoute,
   HttpRestrictedTo,
   HttpUpdatePassword,
};
