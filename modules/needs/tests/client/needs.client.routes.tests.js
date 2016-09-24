(function () {
  'use strict';

  describe('Needs Route Tests', function () {
    // Initialize global variables
    var $scope,
      NeedsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _NeedsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      NeedsService = _NeedsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('needs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/needs');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          NeedsController,
          mockNeed;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('needs.view');
          $templateCache.put('modules/needs/client/views/view-need.client.view.html', '');

          // create mock Need
          mockNeed = new NeedsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Need Name'
          });

          // Initialize Controller
          NeedsController = $controller('NeedsController as vm', {
            $scope: $scope,
            needResolve: mockNeed
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:needId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.needResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            needId: 1
          })).toEqual('/needs/1');
        }));

        it('should attach an Need to the controller scope', function () {
          expect($scope.vm.need._id).toBe(mockNeed._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/needs/client/views/view-need.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          NeedsController,
          mockNeed;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('needs.create');
          $templateCache.put('modules/needs/client/views/form-need.client.view.html', '');

          // create mock Need
          mockNeed = new NeedsService();

          // Initialize Controller
          NeedsController = $controller('NeedsController as vm', {
            $scope: $scope,
            needResolve: mockNeed
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.needResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/needs/create');
        }));

        it('should attach an Need to the controller scope', function () {
          expect($scope.vm.need._id).toBe(mockNeed._id);
          expect($scope.vm.need._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/needs/client/views/form-need.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          NeedsController,
          mockNeed;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('needs.edit');
          $templateCache.put('modules/needs/client/views/form-need.client.view.html', '');

          // create mock Need
          mockNeed = new NeedsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Need Name'
          });

          // Initialize Controller
          NeedsController = $controller('NeedsController as vm', {
            $scope: $scope,
            needResolve: mockNeed
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:needId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.needResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            needId: 1
          })).toEqual('/needs/1/edit');
        }));

        it('should attach an Need to the controller scope', function () {
          expect($scope.vm.need._id).toBe(mockNeed._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/needs/client/views/form-need.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
