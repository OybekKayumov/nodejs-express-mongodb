const fs = require('fs');
const crypto = require('crypto');
// const start = Date.now();
const start = Date.now();

// process.env.UV_THREADPOOL_SIZE = 1;  // same time 1 process
process.env.UV_THREADPOOL_SIZE = 4;

setTimeout(() => console.log('timer 1 finished'), 0 );

setImmediate(() => console.log('Immediate 1 finished'));

fs.readFile('test-file.txt', () => {
  console.log('I/O finished');
  console.log('-------------------');
  
  setTimeout(() => console.log('timer 2 finished'), 0)
  setTimeout(() => console.log('timer 3 finished'), 3000)
  setImmediate(() => console.log('Immediate 2 finished'));

  process.nextTick(() => console.log('Process.nextTick'))

  // crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
  //   console.log(Date.now() - start, "Password encrypted");
  // })

  crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512')
  console.log(Date.now() - start, "Password encrypted 1");
  
  crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512')
  console.log(Date.now() - start, "Password encrypted 2");

  crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512')
  console.log(Date.now() - start, "Password encrypted 3");

  crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512')
  console.log(Date.now() - start, "Password encrypted 4");
})

console.log('Hello from the top-level code');

// 1
// Hello from the top-level code
// timer 1 finished
// Immediate 1 finished
// I/O finished

// 2
// Hello from the top-level code
// timer 1 finished
// Immediate 1 finished
// I/O finished
// -------------------
// Immediate 2 finished  // !
// timer 2 finished
// timer 3 finished

// 3
// Hello from the top-level code
// timer 1 finished
// Immediate 1 finished
// I/O finished
// -------------------
// Process.nextTick       // !
// Immediate 2 finished   // !
// timer 2 finished
// timer 3 finished

// 4
// Hello from the top-level code
// timer 1 finished
// Immediate 1 finished
// I/O finished
// -------------------
// Process.nextTick
// Immediate 2 finished
// timer 2 finished
// 935 Password encrypted    //! async
// timer 3 finished

// 5
// Hello from the top-level code
// timer 1 finished
// Immediate 1 finished
// I/O finished
// -------------------
// 958 Password encrypted 1   // ! sync
// Process.nextTick
// Immediate 2 finished
// timer 2 finished
// timer 3 finished

// 6
// Hello from the top-level code
// timer 1 finished
// Immediate 1 finished
// I/O finished
// -------------------
// 942 Password encrypted 1  // ! sync 4
// 2018 Password encrypted 2
// 2950 Password encrypted 3
// 3886 Password encrypted 4
// Process.nextTick
// Immediate 2 finished
// timer 2 finished
// timer 3 finished



// 34. Events and Event-Driven Architecture

// |          OBSERVER PATTERN            |     
// | Event Emitter   -->   Event Listener |   -->   Attached callback function
// |          emit events                 |  Calls


// emitter                listener              request received
// 127.0.0.1:8000         server.on(...)
                       // instance of EventEmitter class

// 35. Events in Practice
