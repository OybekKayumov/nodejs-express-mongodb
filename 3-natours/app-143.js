/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */
// const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1. Global Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 100 requests from the same IP in 1 hour 
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

app.use(express.json());

// Serving Static Files
app.use(express.static(`${__dirname}/public`))

// app.use((req, res, next) => {
//   console.log('Hello from middleware!');

//   next();  // !
// })

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  console.log('req.headers: ', req.headers);

  next();
})

// 3 Routes, mounting the router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//! put after real routes, order is important
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server...`,
  // })

  // const err = new Error(`Can't find ${req.originalUrl} on this server...`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server...`, 404));
});

// 114. Implementing a Global Error Handling Middleware
// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message
//   });
// });
app.use(globalErrorHandler);

// 4. Start Server
module.exports = app;