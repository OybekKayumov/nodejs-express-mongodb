const express = require('express');
const fs = require('fs');

// read data and convert to array of JS object
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

const getAllTours = (req, res) => {
  console.log('req.requestTime: ', req.requestTime );
  // send back to client
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours
    }
  })
};

const getTour = (req, res) => {
  console.log('req.params: ', req.params );
  const id = req.params.id * 1; // convert string to number
  const tour = tours.find(el => el.id === id)

  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID...'
    })
  }

  res.status(200).json({
    status: 'success',
    data: {
      tours: tour
    }
  });
};

const createTour = (req, res) => {
  console.log(req.body);
  // new tour
  const newId = tours[tours.length -1].id + 1;
  const newTour = Object.assign({id: newId}, req.body)

  // push new tour into the array
  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201)  // 201 created
       .json({
        status: 'success',
        data: {
          tour: newTour
        }
       })
  })
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID ...'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  })
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID ...'
    });
  }
  
  res.status(204).json({  // no-content
    status: 'success',
    data: null,
  })
};

const router = express.Router();

// tourRouter
router
  // .route('/api/v1/tours')
  .route('/')
  .get(getAllTours)
  .post(createTour);

// tourRouter
router
  // .route('/api/v1/tours/:id')
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;