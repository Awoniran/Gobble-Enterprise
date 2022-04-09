const app = require('express')();
const userRouter = require('../routers/users/users');
const productRouter = require('../routers/products/products');
const paymentRouter = require('../routers/payments/payments');
const orderRouter = require('../routers/orders/orders');
const authRouter = require('../routers/auth/auth');

// app.use('/api/v1', userRouter,paymentRouter,paymentRouter,orderRouter,authRouter);

app.use('/api/v1', userRouter);
app.use('/api/v1', orderRouter);
app.use('/api/v1', productRouter);
app.use('/api/v1', paymentRouter);
app.use('/api/v1', authRouter);

module.exports = app;
