/* eslint-disable prefer-object-spread */
/* eslint-disable prettier/prettier */
const fs = require('fs');
const Tour = require('./../models/tourModel');

exports.getAllTours = (req, res) => {
  console.log('req.requestTime: ', req.requestTime );
  // send back to client
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

exports.getTour = (req, res) => {
  console.log('req.params: ', req.params);
  const id = req.params.id * 1; // convert string to number
  const tour = tours.find((el) => el.id === id);

  // if (id > tours.length) {
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID...'
  //   })
  // }

  res.status(200).json({
    status: 'success',
    data: {
      tours: tour,
    },
  });
};

exports.createTour = async (req, res) => {
  try {
    // create 1
    // const newTour = new Tour({});
    // newTour.save().than().catch();

    // create 2
    const newTour = await Tour.create(req.body);

    res.status(201)
      .json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
  } catch (err) {
    // console.log('Error...: ', err);
    res.status(400).json({
      status: 'fail', 
      message: 'Invalid data sent!...'
    })
  }
  

};

exports.updateTour = (req, res) => {  

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

exports.deleteTour = (req, res) => {  

  res.status(204).json({  // no-content
    status: 'success',
    data: null,
  });
};
