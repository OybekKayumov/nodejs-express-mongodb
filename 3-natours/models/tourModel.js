const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      requires: [true, 'A tour must have a name...'],
      unique: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price...'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // not show to users
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  }, // virtual fields are not a part of DB
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 104. Virtual Properties
// getter - will be created each time that we get some data out of the DB
// so this .get() function here is called a GETTER
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7; // this - pointing to the current document
});

// Document middleware, runs before .save and .create, and NOT in .insertMany
tourSchema.pre('save', function (next) {
  // console.log('this: ', this);
  this.slug = slugify(this.name, { lower: true });

  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');

//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log('doc: ', doc);

//   next();
// });

// 106. Query Middleware
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  // all strings start with 'find'
  this.find({ secretTour: { $ne: true } }); // this - query object, ne- not equal

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(` Query took ${Date.now() - this.start} msec.`);
  console.log('docs: ', docs);

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// 105. Document Middleware in mongoose:
// 4: document, query, aggregate, model

//TODO: before saving
// this:  {
//   name: 'Test tour',
//   duration: 1,
//   maxGroupSize: 1,
//   difficulty: 'difficult',
//   ratingsAverage: 4.5,
//   ratingsQuantity: 0,
//   rating: 4.5,
//   price: 997,
//   summary: 'test tour...',
//   imageCover: 'tour-3-cover.jpg',
//   images: [],
//   createdAt: 2023-05-22T06:42:20.497Z,
//   startDates: [],
//   _id: new ObjectId("646b0f99d3dcb8a4316102d9"),
//   durationWeeks: 0.14285714285714285,
//   id: '646b0f99d3dcb8a4316102d9'
// }

// slug is a string that we can put in the URL, usually based on some string like the name
// npm i slugify

// "slug": "test-tour-3",
