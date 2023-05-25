/* eslint-disable import/no-extraneous-dependencies */
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
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    // check for correct email address
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
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
});

userSchema.pre('save', async function (next) {
  // only run this function if pwd was modified
  if (!this.isModified('password')) return next();

  // pwd encryption
  this.password = await bcrypt.hash(this.password, 12);

  // after encryption delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

// check entered pwd with pwd in DB, returns true or false
userSchema.methods.correctPassword = async function (candidatePwd, userPwd) {
  return await bcrypt.compare(candidatePwd, userPwd);
};

userSchema.methods.changedPwdAfter = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    console.log(': ', this.passwordChangedAt, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // false means not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

// 134. Authorization: User Roles and Permissions
// {
//   "status": "success",
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NmYxM2VmZjU2ZTMyOTM5YzJkMmNjYSIsImlhdCI6MTY4NTAwMTE5OSwiZXhwIjoxNjkyNzc3MTk5fQ.zqTle4ft3JzKMG1Gm_Uq187gyMLUZcnaddRVQQrGrLk",
//   "data": {
//       "user": {
//           "name": "john",
//           "email": "john@mail.com",
//           "role": "user",
//           "password": "$2a$12$ZKrvXJPi31/9HfvuNuA6GOJJ17d4eCwIImQuwCLIN2L6oBenwJMP.",
//           "_id": "646f13eff56e32939c2d2cca",
//           "__v": 0
//       }
//   }
// }
