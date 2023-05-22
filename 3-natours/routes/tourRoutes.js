/* eslint-disable import/no-useless-path-segments */
const express = require('express');

const tourController = require('./../controllers/tourController');

const router = express.Router();

// 100. Aliasing
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

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
