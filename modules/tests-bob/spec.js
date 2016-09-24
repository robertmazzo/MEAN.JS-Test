// spec.js
describe('Protractor Demo App', function() {
  it('should have a title', function() {
    browser.get('http://localhost:3000/');

    expect(browser.getTitle()).toEqual('MEAN.JS - Development Environment');
  });
});

describe('Protractor Demo App', function() {
  it('should prompt to sign in', function() {
    browser.get('http://localhost:3000/settings/profile');

    //element(by.model('first')).sendKeys(1);
    //element(by.model('second')).sendKeys(2);

    //element(by.id('gobutton')).click();
    //expect(element(by.binding('latest')).getText()).toEqual('5'); // This is wrong!
  });
});