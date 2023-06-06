/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const slugify = require('slugify');
// eslint-disable-next-line no-unused-vars
const validator = require('validator');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'], // ! no spaces
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.66, 46.6, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    // },
    // rating: {
    //   type: Number,
    //   default: 4.5,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //! if we need "this", we use function, else we can use arrow function
          // "this" only points to current doc on NEW document creation, NOT to update
          return val < this.price; // 100 < 200 true, 250 < 200 false
        },
      },
      message: 'Discount price ({VALUE}) should be below regular price',
    },
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
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'], // can be only 'Point'
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guides: Array,
    // Modelling Tour Guides: Child Referencing
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  }, // virtual fields are not a part of DB
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// tourSchema.index({ price: 1 }); // sorting, -1
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// 104. Virtual Properties
// getter - will be created each time that we get some data out of the DB
// so this .get() function here is called a GETTER
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
  // this - pointing to the current document
});

// Virtual Populate: Tours and Reviews
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// Document middleware, runs before .save and .create, and NOT in .insertMany
tourSchema.pre('save', function (next) {
  // console.log('this: ', this);
  this.slug = slugify(this.name, { lower: true });

  next();
});

//todo: Modelling Tour Guides: Embedding, create
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);

//   next();
// });

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
  this.find({ secretTour: { $ne: true } });
  // this - query object, ne- not equal

  this.start = Date.now();
  next();
});

// Populating Tour Guides
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt', // show data without this 2 fields
  });

  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  // console.log('docs: ', docs);

  next();
});

// 107. Aggregation Middleware
// tourSchema.pre('aggregate', function (next) {
// add at the beginning of array
// this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

// next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// slug is a string that we can put in the URL, usually based on some string like the name
