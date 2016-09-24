'use strict';

angular.module('needs').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Needs',
      state: 'needs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'needs', {
      title: 'List needs',
      state: 'needs.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'needs', {
      title: 'Create needs',
      state: 'needs.create',
      roles: ['user']
    });
  }
]);
