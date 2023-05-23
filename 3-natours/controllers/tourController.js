/* eslint-disable import/no-useless-path-segments */
/* eslint-disable prefer-object-spread */
/* eslint-disable prettier/prettier */
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary, difficulty';

  next();
}

exports.getAllTours = async (req, res) => {
  try {    
    //TODO: execute query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    //TODO: send response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
};

exports.getTour = async (req, res) => {
 try {
  const tour = await Tour.findById(req.params.id)  // find one item
                 //  Tour.findOne({ _id: req.params.id}) 
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
 } catch (err) {
  res.status(404).json({
    status: 'fail',
    message: err,
  })
 }
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
    res.status(400).json({
      status: 'fail', 
      message: err
    })
  }
};

exports.updateTour = async (req, res) => {  
  try { 
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true   // !
    })
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail', 
      message: err
    })
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)

    res.status(204).json({  // no-content
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail', 
      message: err
    })
  }
};

// 102. Aggregation Pipeline: Matching and Grouping
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5} }
      },
      {
        $group: { 
          _id: {$toUpper: '$difficulty' },
          // _id: '$ratingsAverage',
          numTours: { $sum: 1},
          numRatings: { $sum: '$ratingsQuantity'},
          avgRating: { $avg: '$ratingsAverage'},
          avgPrice: { $avg: '$price'},
          minPrice: { $min: '$price'},
          maxPrice: { $max: '$price'},
        }
      },
      {
        $sort: { avgPrice: 1}
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
  } catch (err) {
    res.status(404).json({
      status: 'fail', 
      message: err
    })
  }
}

// 103. Aggregation Pipeline: Unwinding and Projecting
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;  // to Number
    
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
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail', 
      message: err
    })
  }
}