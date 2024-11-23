const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
          email: {
                    type: String,
                    required: [true, 'Email is required'],
                    unique: [true, 'Email must be unique!'],
                    minLength: [5, 'Email must be at least 10 characters long'],
                    lowercase: true,
                    trim: true,
          },
          password: {
                    type: String,
                    required: [true, 'Password is required'],
                    trim: true,
                    select: false,
          },
          verified: {
                    type: Boolean,
                    default: false,
          },
          verficationCode: {
                    type: String,
                    select: false,
          },
          verficationCodeValidation: {
                    type: String,
                    select: false,
          },
          forgotPasswordCode: {
                    type: String,
                    select: false,
          },
          forgotPasswordCodeValidation: {
                    type: String,
                    select: false,
          },

}, {
          timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;