/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable prefer-object-spread */
/* eslint-disable prettier/prettier */
const multer = require('multer');
const sharp = require('sharp');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}); 

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name : 'images', maxCount: 3 },
]);

// upload.single('image')      req.file
// upload.array('images', 5);  req.files

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // cover image
  // const imageCoverFilename = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    // .toFile(`public/img/tours/${imageCoverFilename}`);
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // req.body.imageCover = imageCoverFilename;

  // images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, ind) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${ind + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })  
        .toFile(`public/img/tours/${filename}`);
      
      req.body.images.push(filename);
    })
  );

  next();
});

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};


exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

// 102. Aggregation Pipeline: Matching and Grouping
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: { 
        _id: { $toUpper: '$difficulty' },
        // _id: '$ratingsAverage',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      }
    },
    {
      $sort: { avgPrice: 1 }
    },
    // {
    //   $match: { _id: { $ne: 'EASY' }}  // not equal - ne
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });  
});

// 103. Aggregation Pipeline: Unwinding and Projecting
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // to Number
  
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0    // do not show id
      }
    },
    {
      $sort: { numTourStarts: -1 }   // start from highest number
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  // if in miles divide by 3963.2 km, and if in km than divide by 6778.1km
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if(!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat, lng.',
        400
    ))
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius ] } } 
  });

  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      data: tours,
    }
  })
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if(!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat, lng.',
        400
    ))
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        // distanceMultiplier: 0.001, // in km
        distanceMultiplier: multiplier,
      }
    },
    {
      $project: {
        distance: 1,
        name: 1,
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    }
  })
});
