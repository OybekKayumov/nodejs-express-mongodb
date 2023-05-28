/* eslint-disable import/no-useless-path-segments */
const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

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
  // if user is not authenticated, will be error. protect recourses from not logged in users
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

// tourRouter
router
  // .route('/api/v1/tours/:id')
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// Implementing Simple Nested Routes
// /POST /tour/123wer4/reviews
// /GET /tour/123wer4/reviews/
// /GET /tour/123wer4/reviews/987654fte
router
  .route('/:tourId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('users'),
    reviewController.createReview
  );

module.exports = router;
