/* eslint-disable import/no-useless-path-segments */
const express = require('express');

const tourController = require('./../controllers/tourController');

const router = express.Router();

// tourRouter
router
  // .route('/api/v1/tours')
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

// tourRouter
router
  // .route('/api/v1/tours/:id')
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
