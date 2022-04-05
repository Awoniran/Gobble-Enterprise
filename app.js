const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const AppError = require('./src/utils/AppError/appError');

const HttpErrHandler = require('./src/controllers/err/errorHandler');
// const API_version1 = require('./src/api/version/version1');
const API_version1 = require('./src/api/version/version1');

const app = express();

//APP SECURITIES
app.use(cors('*'));
app.use(helmet());

//GENERAL MIDDLEWARE
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan('combined'));

//APP ROUTERS

// app.use('/', (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'Welcome to Gooble enterprise API',
//   });
// });

// use this for api version control
app.use(API_version1);

app.use('*', (req, res, next) => {
  return next(
    new AppError(`can't find ${req.originalUrl} on this server`, 404)
  );
});

app.use(HttpErrHandler);

module.exports = app;
