const fs = require('fs');
const express = require('express');

const app = express();

// read data and convert to array of JS object
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

app.get('/api/v1/tours', (req, res) => {
  // send back to client
  res.status(200).json({
    status: 'success',
    data: {
      tours: tours
    }
  })
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
})
