const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const pug = require('pug');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const AppError = require('./src/utils/AppError/appError');
const API_version_1 = require('./src/api/version/version1');
const HttpErrHandler = require('./src/controllers/err/errorHandler');

const app = express({ strict: true });

//APP VIEWS
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src/public/templates/emails'));

//APP SECURITIES
app.use(cors());
app.use(helmet());

//GENERAL MIDDLEWARE
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan('combined'));

//APP ROUTERS
app.get('/', (req, res) => {
   res.status(200).json({
      status: 'success',
      message: 'Welcome to Gooble enterprise API',
   });
});

//USE FOR API VERSION CONTROL
app.use(API_version_1);

//HANDLING UNDEFINED ROUTES
app.use('*', (req, res, next) => {
   return next(
      new AppError(`can't find ${req.originalUrl} on this server`, 404)
   );
});

//THE GENERAL ERROR HANDLER MIDDLEWARE
app.use(HttpErrHandler);

module.exports = app;
