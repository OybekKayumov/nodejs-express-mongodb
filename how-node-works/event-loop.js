const fs = require('fs');

setTimeout(() => {
  console.log('timer 1 finished ');
}, 0 );

setImmediate(() => console.log('Immediate 1 finished'));

fs.readFile('test-file.txt', () => {
  console.log('I/O finished');
})

console.log('Hello from the top-level code');

// Hello from the top-level code
// timer 1 finished
// Immediate 1 finished
// I/O finished