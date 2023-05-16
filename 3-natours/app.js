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

app.post('/api/v1/tours', (req, res) => {

})

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
})
