const EventEmitter = require('events');
const http = require('http');

// const myEmitter = new EventEmitter();

class Sales extends EventEmitter {  // EventEmitter is super class
  constructor() {
    super();
    
  }
}

const myEmitter = new Sales();

myEmitter.on('newSale', () => {
  console.log('There was a new sale!');
})

myEmitter.on('newSale', () => {
  console.log('Customer name: John');
})

myEmitter.on('newSale', stock => {
  console.log(`There are now ${stock} items left in stock.`);
})

myEmitter.emit('newSale', 9);
// 1
// There was a new sale!
// Customer name: John

//! this is a observer pattern

// 2
// There was a new sale!
// Customer name: John
// There are now 9 items left in stock.


//
// create small web server and listen to the event
const server = http.createServer();

// listening for "request" event
// server.on('request', callback_function)
server.on('request', (req, res) => {
  console.log('Request received!');
  // send back
  res.end('Request received...')
})

server.on('request', (req, res) => {  
  console.log('Another Request')
})

server.on('close', (req, res) => {
  console.log('Server closed!');  
})

// start server, event loop is waiting for incoming Input/Output
server.listen(8000, '127.0.0.1', () => {
  console.log('Waiting for request...');
})