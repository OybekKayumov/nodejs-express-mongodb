// 1
// console.log(arguments);
// array Arguments
// [Arguments] {
//   '0': {},
//   '1': [Function: require] {
    
//   },
//   '2': Module {
    
//   },
//   '3': 'file name',
//   '4': 'folder'
// }

// 2
// console.log(require('module').wrapper);
// [
//   '(function (exports, require, module, __filename, __dirname) { ',  
//   '\n});'
// ]

// 3 modules exports
const Calculator = require('./test-module-1.js');
const calc1 = new Calculator();

console.log('calc1: ',calc1.add(2, 5));
// add:  7

// exports
const calc2 = require('./test-module-2.js')
const {add, multiply, divide} = require('./test-module-2.js')
// console.log('calc2: ', calc2.add(3, 5));
console.log('calc2: ', multiply(3, 5));      // 15
console.log('calc2: ', divide(3, 5));        // 0.6

// caching
require('./test-module-3.js')()
require('./test-module-3.js')()
require('./test-module-3.js')()
// Hello from the module
// Log this test N3     
// Log this test N3     // from cache
// Log this test N3     // from cache