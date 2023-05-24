const mongoose = require('mongoose');
const validator = require('validator');

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
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
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
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
