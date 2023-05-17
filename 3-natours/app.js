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

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
})


// patch - partial data will be updated without changing the whole data
// put - update the whole resource