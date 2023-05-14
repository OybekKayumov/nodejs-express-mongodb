const EventEmitter = require('events');

const myEmitter = new EventEmitter();

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