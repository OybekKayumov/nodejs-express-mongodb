const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  // 1 get tour data from collection
  
  // 2 build template
  // 3 render template using tour data from 1

  res.status(200).render('overview', {
    title: 'All Tours',
  });
});

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
};
