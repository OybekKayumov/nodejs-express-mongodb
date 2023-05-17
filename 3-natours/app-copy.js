// ****************************************************
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  // res.status(200).send('Hello from the server side!');
  res
    .status(200)
    .json({message: 'Hello from the server side!', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint...')
})

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
})

// 51. APIs and RESTful API Design
// API - application programming interface
  // -- web APIs
  // -- node APIs
  // Browser's DOM JS API
  // with OOP created API

// REST
  // - separate API into logical resources
  // - expose(made available using) structured, resource-based URLs
  // - use HTTP methods(verbs), not the URL, to read, create, update, delete ... data
  // - send data as JSON (usually)
  // - be stateless.

// CRUD operations


// JSON 
  // - string - value
  // - key-value pair
  // Object, Array
  // response formatting

// all state is handle on the client
  // state simply refers to a piece of data in the application that might  change over time: for example, loggedIn, currentPage

// ****************************************************
//TODO: 57. Refactoring Our Routes
const fs = require('fs');
const express = require('express');

const app = express();

// middleware is basically function that can modify the incoming request data
// it stands between, in the middle of the request and response
// here data from the body is added to request object
app.use(express.json());

// read data and convert to array of JS object
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

app.get('/api/v1/tours', (req, res) => {
  // send back to client
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours
    }
  })
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
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

  // res.send('Done');
})

app.patch('/api/v1/tours/:id', (req, res) => {
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
})

app.delete('/api/v1/tours/:id', (req, res) => {
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
})

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
})


// patch - partial data will be updated without changing the whole data
// put - update the whole resource


// ****************************************************
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// 1. Middlewares
app.use(morgan('dev'));

// middleware is basically function that can modify the incoming request data
// it stands between, in the middle of the request and response
// here data from the body is added to request object
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

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

// app.use((req, res, next) => {
//   console.log('Hello from middleware!');

//   next();
// })

app
  .route('/api/v1/tours/:id')
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

// 58. Middleware and the Request-Response Cycle

//                 |        // Middleware Stack         |
//    Request -->     middleware     middleware    middleware   -->  Response
// req obj, res obj   next()         next()        res.send(...)
                   // parsing body   logging       router
                   //                setting headers

// |                 Request-Response Cycle                              |

// everything is middleware, even routes
// Order as defined in code
// Pipeline - data go through from request to final response

// 59. Creating Our Own Middleware

