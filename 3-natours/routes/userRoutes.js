const express = require('express');
const fs = require('fs');

// read data and convert to array of JS object
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error...',
    message: 'This route is not defined yet'
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error...',
    message: 'This route is not defined yet'
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error...',
    message: 'This route is not defined yet'
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error...',
    message: 'This route is not defined yet'
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error...',
    message: 'This route is not defined yet'
  });
};

const router = express.Router();

// user route
router
  .route('/')
  .get(getAllUsers)
  .post(createUser); 

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser)

module.exports = router;
