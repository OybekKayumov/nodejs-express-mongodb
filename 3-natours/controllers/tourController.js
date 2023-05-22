/* eslint-disable import/no-useless-path-segments */
/* eslint-disable prefer-object-spread */
/* eslint-disable prettier/prettier */
// const fs = require('fs');
const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    //TODO: build query
    // copy of query
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...req.query };  // new object
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    // delete from query object fields
    excludedFields.forEach(el => delete queryObj[el]);
    
    // console.log('req.query: ', req.query, queryObj);

    // const tours = await Tour.find();  // return all items
    
    // query 1
    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy'
    // });
    
    // query 2
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy')
    
    // const tours = await Tour.find(req.query);
    // req.query:  { difficulty: 'easy', page: '2', limit: '1', sort: '1', fields: '2' } { difficulty: 'easy' }

    //! 96. Making the API Better: Advanced Filtering
    // {difficulty: 'easy', duration: {$gte: 5} }  grater or equal than 5
    // duration[gte]=5,  gte, gt, lte, lt --> to get $gte
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)  // g - replace all
    console.log(': ', JSON.parse(queryStr)); 
    // { duration: { '$gte': '5' } }

    // const query = Tour.find(queryObj);  // returns query, that we can use later find, sort, limit and fields
    let query = Tour.find(JSON.parse(queryStr));
    // http://127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=easy&price[lt]=1500

    // 97. Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      // query = query.sort(req.query.sort);
      query = query.sort(sortBy);
      // sort('price ratingsAverage')
    }  else {
      query = query.sort('-createdAt');
    }

    // 98. Limiting Fields
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      // query = query.select('name duration price');  // projecting
      query = query.select(fields);      
    }  else {
      query = query.select('-__v'); // '-' not including, excluding field __v
    }

    // 99. Pagination, /tours?page=2&limit=10
    const page = req.query.page * 1 || 1;   // convert string to number
    const limit = req.query.limit * 1 || 100;
    const skip = (page -1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    //TODO: execute query
    const tours = await query;

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
      runValidators: true
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
