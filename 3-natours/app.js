const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1. Middlewares
app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from middleware!');

  next();  // !
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
})

// mounting the router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4. Start Server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
})
