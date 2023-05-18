const express = require('express');
const fs = require('fs');

const tourController = require('./../controllers/tourController');

const router = express.Router();


// 64. Param Middleware
// param middleware is middleware that only tuns for certain parameters
// for example: id.
// we can write middleware that only runs when this id present in the URL
router.param('id', tourController.checkID)

// create a checkBody middleware
// check if body contains the name and price property
// if not, send back 400 - bad request
// add it to the post handler stack

// tourRouter
router
  // .route('/api/v1/tours')
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

// tourRouter
router
  // .route('/api/v1/tours/:id')
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;