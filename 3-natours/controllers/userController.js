const fs = require('fs');

// read data and convert to array of JS object
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error...',
    message: 'This route is not defined yet'
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error...',
    message: 'This route is not defined yet'
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error...',
    message: 'This route is not defined yet'
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error...',
    message: 'This route is not defined yet'
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error...',
    message: 'This route is not defined yet'
  });
};