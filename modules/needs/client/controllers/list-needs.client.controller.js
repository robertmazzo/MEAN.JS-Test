(function () {
  'use strict';

  angular
    .module('needs')
    .controller('NeedsListController', NeedsListController);

  NeedsListController.$inject = ['NeedsService'];

  function NeedsListController(NeedsService) {
    var vm = this;

    vm.needs = NeedsService.query();
  }
}());
