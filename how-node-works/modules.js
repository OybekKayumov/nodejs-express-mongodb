console.log(arguments);
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

console.log(require('module').wrapper);
// [
//   '(function (exports, require, module, __filename, __dirname) { ',  
//   '\n});'
// ]

