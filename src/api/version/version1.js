const app_v1 = require('express')();

const authRouter = require('../routers/auth/auth');
const userRouter = require('../routers/users/users');
const orderRouter = require('../routers/orders/orders');
const reviewRouter = require('../routers/reviews/reviews');
const productRouter = require('../routers/products/products');
const paymentRouter = require('../routers/payments/payments');

app_v1.use('/api/v1', productRouter); //done
app_v1.use('/api/v1', authRouter); //done
app_v1.use('/api/v1', userRouter); //done
app_v1.use('/api/v1', reviewRouter); //currently working on it
app_v1.use('/api/v1', orderRouter);
app_v1.use('/api/v1', paymentRouter);

module.exports = app_v1;
