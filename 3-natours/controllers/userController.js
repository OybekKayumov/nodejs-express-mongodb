/* eslint-disable import/no-useless-path-segments */
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // res.status(500).json({
  //   status: 'error...',
  //   message: 'This route is not defined yet'
  // });
  const users = await User.find();

  //TODO: send response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = (req, res, next) => {
  // create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassowrd.',
        400
      )
    );
  }

  // update user document
  res.status(200).json({
    status: 'success',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error...',
    message: 'This route is not defined yet',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error...',
    message: 'This route is not defined yet',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error...',
    message: 'This route is not defined yet',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error...',
    message: 'This route is not defined yet',
  });
};
