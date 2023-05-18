/* eslint-disable prettier/prettier */
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

// 67. Environment Variables
// dotenv.config({ path: './config.env' });
// console.log('app.get.env: ', app.get('env')); // app.get.env:  development
console.log('process.env: ', process.env); // ...

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// eslint-disable-next-line prettier/prettier
// 68. Setting up ESLint + Prettier in VS Code
// esLint is a programm that constantly scans code and finds potential coding errors or bad coding practices that it thinks are wrong
