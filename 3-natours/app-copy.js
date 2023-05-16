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
  

