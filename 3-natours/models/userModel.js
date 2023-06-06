/* eslint-disable import/no-extraneous-dependencies */
const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// name, email, photo, password, password confirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    // check for correct email address
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false, // not show in output pwd
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // we need to use "this" keyword. Function. not arrow function
      //! only works on CREATE and SAVE, not update
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

/* comment when seed DB */
userSchema.pre('save', async function (next) {
  // only run this function if pwd was modified
  if (!this.isModified('password')) return next();

  // pwd encryption
  this.password = await bcrypt.hash(this.password, 12);

  // after encryption delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

// runs before saving
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  // ensure that token is always created after pwd has been changed -1second
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
/* comment when seed DB */

// do not select not active users
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  // not equal to false

  next();
});

// check entered pwd with pwd in DB, returns true or false
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // console.log(': ', this.passwordChangedAt, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // false means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // to send to user
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  // 10 min

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
