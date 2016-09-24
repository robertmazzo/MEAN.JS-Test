'use strict';

describe('Needs E2E Tests:', function () {
  describe('Test Needs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/needs');
      expect(element.all(by.repeater('need in needs')).count()).toEqual(0);
    });
  });
});
