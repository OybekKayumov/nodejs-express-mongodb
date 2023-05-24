/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// 123. Catching Uncaught Exceptions
process.on('uncaughtException', err => {
  console.log('Uncaught Exceptions!!! Shutting down...');
  console.log(err.name, err.message);

  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

mongoose
  // local mongodb
  .connect(process.env.DATABASE_LOCAL, {

  // .connect(DB, {
  //   useNewUrlParser: true,
  //   // useCreateIndex: true,
  //   // useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connections successfully !!');
  })
  .catch((err) => {
    console.log(err);
  });

const app = require('./app');

// Start Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
 
// 122. Errors Outside Express: Unhandled Rejections, incorrect pwd
process.on('unhandledRejection', err => {
  console.log('Unhandled Rejections!!! Shutting down...');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  })
});
