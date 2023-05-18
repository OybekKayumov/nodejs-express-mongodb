const dotenv = require('dotenv');
const app = require('./app');

// 67. Environment Variables
dotenv.config({ path: './config.env' });
// console.log('app.get.env: ', app.get('env')); // app.get.env:  development
console.log('process.env: ', process.env); // ...

// Start Server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
})
