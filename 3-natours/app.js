const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// 1. Middlewares
app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from middleware!');

  next();  // !
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
})

// read data and convert to array of JS object
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

// 2. Route handlers
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

// users
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error...',
    message: 'This route is not defined yet'
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error...',
    message: 'This route is not defined yet'
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error...',
    message: 'This route is not defined yet'
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error...',
    message: 'This route is not defined yet'
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error...',
    message: 'This route is not defined yet'
  });
};

// 3. Routes
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.use('/api/v1/tours', tourRouter);
const tourRouter = express.Router();

// app
tourRouter
  // .route('/api/v1/tours')
  .route('/')
  .get(getAllTours)
  .post(createTour);

// app
tourRouter
  // .route('/api/v1/tours/:id')
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// user route
app
  .route('/api/v1/users')
  .get(getAllUsers)
  .post(createUser); 

app.route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser)

// 4. Start Server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
})
