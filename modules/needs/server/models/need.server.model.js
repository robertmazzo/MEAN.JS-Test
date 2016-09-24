'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Need Schema
 */
var NeedSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Need name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Need', NeedSchema);
