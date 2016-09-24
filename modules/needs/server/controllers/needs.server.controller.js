'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Need = mongoose.model('Need'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Need
 */
exports.create = function(req, res) {
  var need = new Need(req.body);
  need.user = req.user;

  need.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(need);
    }
  });
};

/**
 * Show the current Need
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var need = req.need ? req.need.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  need.isCurrentUserOwner = req.user && need.user && need.user._id.toString() === req.user._id.toString();

  res.jsonp(need);
};

/**
 * Update a Need
 */
exports.update = function(req, res) {
  var need = req.need;

  need = _.extend(need, req.body);

  need.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(need);
    }
  });
};

/**
 * Delete an Need
 */
exports.delete = function(req, res) {
  var need = req.need;

  need.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(need);
    }
  });
};

/**
 * List of Needs
 */
exports.list = function(req, res) {
  Need.find().sort('-created').populate('user', 'displayName').exec(function(err, needs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(needs);
    }
  });
};

/**
 * Need middleware
 */
exports.needByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Need is invalid'
    });
  }

  Need.findById(id).populate('user', 'displayName').exec(function (err, need) {
    if (err) {
      return next(err);
    } else if (!need) {
      return res.status(404).send({
        message: 'No Need with that identifier has been found'
      });
    }
    req.need = need;
    next();
  });
};
