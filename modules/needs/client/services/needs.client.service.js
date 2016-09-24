// Needs service used to communicate Needs REST endpoints
(function () {
  'use strict';

  angular
    .module('needs')
    .factory('NeedsService', NeedsService);

  NeedsService.$inject = ['$resource'];

  function NeedsService($resource) {
    return $resource('api/needs/:needId', {
      needId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
