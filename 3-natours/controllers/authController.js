/* eslint-disable import/no-useless-path-segments */
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

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
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    // send token to client
    token,
    data: {
      user: newUser,
    },
  });
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
