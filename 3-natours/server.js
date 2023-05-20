/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

/*
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
 
dbConnect().catch(err => console.log(err));
 
async function dbConnect() {
  await mongoose.connect(DB);
}
*/

mongoose
  // local mongodb
  // .connect(process.env.DATABASE_LOCAL, {

  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then((con) => {
    console.log(con.connections);
    console.log('DB connections successfully !!');
  })
  .catch((err) => {
    console.log(err);
  });

const app = require('./app');

// 67. Environment Variables
// dotenv.config({ path: './config.env' });
// console.log('app.get.env: ', app.get('env')); // app.get.env:  development
// console.log('process.env: ', process.env); // ...

// 85. Creating a Simple Tour Mode
// to create a model we need a schema
const tourSchema = new mongoose.Schema({
  name: {
   type: String,
   requires: [true,'A tour must have a name'], 
   unique: true,
  },
  rating: {
   type: Number,
   default: 4.5
  },
  price: {
   type: Number,
   required: [true,'A tour must have a price']
  },
})

// model 

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// eslint-disable-next-line prettier/prettier
// 68. Setting up ESLint + Prettier in VS Code
// esLint is a program that constantly scans code and finds potential coding errors or bad coding practices that it thinks are wrong
