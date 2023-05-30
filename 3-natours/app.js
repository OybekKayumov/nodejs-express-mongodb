/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */
// const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// Setting up Pug in Express
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));  // /views

// 1. Global Middlewares
// Serving Static Files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// Setting Security HTTP Headers
app.use(helmet());

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit 100 requests from the same IP in 1 hour 
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// data sanitization against NoSQL query injection
//Login as: "email": { "$gt": ""}. "password": "password"
app.use(mongoSanitize());

// data sanitization against XSS, some malicious HTML code
app.use(xss());

// preventing parameter pollution, search
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ]
  })
);

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  // console.log('req.headers: ', req.headers);
  next();
});

// 3 Routes, mounting the router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//! put after real routes, order is important
app.all('*', (req, res, next) => {  

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 114. Implementing a Global Error Handling Middleware
app.use(globalErrorHandler);

// 4. Start Server
module.exports = app;
