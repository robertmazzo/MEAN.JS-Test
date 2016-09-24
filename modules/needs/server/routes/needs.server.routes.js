'use strict';

/**
 * Module dependencies
 */
var needsPolicy = require('../policies/needs.server.policy'),
  needs = require('../controllers/needs.server.controller');

module.exports = function(app) {
  // Needs Routes
  app.route('/api/needs').all(needsPolicy.isAllowed)
    .get(needs.list)
    .post(needs.create);

  app.route('/api/needs/:needId').all(needsPolicy.isAllowed)
    .get(needs.read)
    .put(needs.update)
    .delete(needs.delete);

  // Finish by binding the Need middleware
  app.param('needId', needs.needByID);
};
