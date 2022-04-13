const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const response = require('../../utils/res/response');
const AppError = require('../../utils/AppError/appError');
// const { user } = require('pg/lib/defaults');
const { user } = new PrismaClient();

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
    const { email, password, name } = req.body;
    if (!email || !password || !name)
      return next(new AppError('missing required field(s)', 400));
    if (await existingUser(email))
      return next(new AppError('There is a user with the provided email', 409));
    const newUser = await user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        password: await hashPassword(req.body.password),
      },
    });
    response(res, 200, 'Account created successfully');
  } catch (err) {
    return next(
      new AppError('oppss!!!, something went very wrong,kindly try again', 500)
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
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token)
    return next(
      new AppError('you are not logged in , kindly login to access', 401)
    );
  const payload = verifyToken(token);
  const currentUser = await user.findFirst({
    where: { id: payload.id, active: true },
  });
  if (!currentUser)
    return next(new AppError('there is no user with the provided token', 401));
  req.user = currentUser;
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

//will be implemented soon
async function HttpResetPassword(req, res, next) {
  // compare the random bytes,
  // reset the password
  // set the random bytes in the database to undefined,
  //
}
async function HttpForgotPassword(req, res, next) {
  //check if the email exist
  //generate a random byte
  //hash and save the byte in the database
  //send the random byte to the user's email
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
