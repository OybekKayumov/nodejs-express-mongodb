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

// 3
const Calculator = require('./test-module-1.js');
const calc1 = new Calculator();

console.log('add: ',calc1.add(2, 5));