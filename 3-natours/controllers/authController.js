/* eslint-disable arrow-body-style */
/* eslint-disable import/no-useless-path-segments */
// const util = require('util');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // create token
  // const token = jwt.sign({ id: newUser._id }, 'secret', expire_time);
  const token = signToken(newUser._id);
  //   jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });

  res.status(201).json({
    status: 'success',
    // send token to client
    token,
    data: {
      user: newUser,
    },
  });
});

// Logging in Users
exports.login = catchAsync(async (req, res, next) => {
  // read email and pwd from the body
  const { email, password } = req.body;

  // check if email and pwd exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // check if email and pwd exist && correct
  const user = await User.findOne({ email }).select('+password');
  console.log('user: ', user);

  // check pwd function in userModel
  // const correct = await user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // if email and pwd OK, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

// Protecting Tour Routes
exports.protect = catchAsync(async (req, res, next) => {
  // get token and check of it's true
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startWith('Bearer')
  ) {
    // take 2nd element of array after space
    token = req.headers.authorization.split(' ')[1];
  }

  // console.log('token Bearer : ', token);

  // if there is no token
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // verification, validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log('decoded: ', decoded);

  // check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  // check if user changed pwd after jwt-token was issued
  if (freshUser.changedPwdAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please log in again.', 401)
    );
  }

  next();
});

// {
//   "status": "success",
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NmRkOTIxOTMwZjlmOWUyOGNjZDdlMyIsImlhdCI6MTY4NDkyMDYwOSwiZXhwIjoxNjkyNjk2NjA5fQ.HPws6KnQKuRmkAIAjS2XuAlIk54vxYYseVr0hRjmbnI",
//   "data": {
//       "user": {
//           "name": "john1",
//           "email": "john1@mail.com",
//           "password": "$2a$12$7wiMYh0rQoaz/LSP6TSAtuzthN0XLH3O2/v/f0z8ihRwDzimSbgYq",
//           "_id": "646dd921930f9f9e28ccd7e3",
//            "id": "646dd921930f9f9e28ccd7e3" //! from jwt.io
//           "__v": 0
//       }
//   }
// }

//todo: user login
// {
//   "status": "success",
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NmRkOTIxOTMwZjlmOWUyOGNjZDdlMyIsImlhdCI6MTY4NDk3NTM2MywiZXhwIjoxNjkyNzUxMzYzfQ.kZvhqUIUYPPkv_1TuhWHanLwdvsgWUiICixWYzy6WGo"
// }
