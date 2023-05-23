/* eslint-disable prettier/prettier */
// const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1. Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// Serving Static Files
app.use(express.static(`${__dirname}/public`))

// app.use((req, res, next) => {
//   console.log('Hello from middleware!');

//   next();  // !
// })

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
})

// 3 Routes, mounting the router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server...`,
  })
});

// 4. Start Server
module.exports = app;