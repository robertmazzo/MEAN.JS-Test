(function () {
  'use strict';

  angular
    .module('needs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('needs', {
        abstract: true,
        url: '/needs',
        template: '<ui-view/>'
      })
      .state('needs.list', {
        url: '',
        templateUrl: 'modules/needs/client/views/list-needs.client.view.html',
        controller: 'NeedsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Needs List'
        }
      })
      .state('needs.create', {
        url: '/create',
        templateUrl: 'modules/needs/client/views/form-need.client.view.html',
        controller: 'NeedsController',
        controllerAs: 'vm',
        resolve: {
          needResolve: newNeed
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Needs Create'
        }
      })
      .state('needs.edit', {
        url: '/:needId/edit',
        templateUrl: 'modules/needs/client/views/form-need.client.view.html',
        controller: 'NeedsController',
        controllerAs: 'vm',
        resolve: {
          needResolve: getNeed
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Need {{ needResolve.name }}'
        }
      })
      .state('needs.view', {
        url: '/:needId',
        templateUrl: 'modules/needs/client/views/view-need.client.view.html',
        controller: 'NeedsController',
        controllerAs: 'vm',
        resolve: {
          needResolve: getNeed
        },
        data: {
          pageTitle: 'Need {{ needResolve.name }}'
        }
      });
  }

  getNeed.$inject = ['$stateParams', 'NeedsService'];

  function getNeed($stateParams, NeedsService) {
    return NeedsService.get({
      needId: $stateParams.needId
    }).$promise;
  }

  newNeed.$inject = ['NeedsService'];

  function newNeed(NeedsService) {
    return new NeedsService();
  }
}());
