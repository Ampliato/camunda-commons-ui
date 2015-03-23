/* jshint node: true, unused: false */
/* global __dirname: false, describe: false, beforeEach: false, it: false, browser: false,
          element: false, expect: false, by: false, protractor: false */
'use strict';

function Header(node) {
  this.node = node;
}

Header.prototype.transcludedText = function() {
  return this.node.element(by.css('[ng-transclude]')).getText();
};
Header.prototype.account = function() {
  return this.node.element(by.css('.cam-nav .account'));
};
Header.prototype.accountText = function() {
  return this.node.element(by.css('.cam-nav .account > a')).getText();
};
Header.prototype.adminLink = function() {
  return this.node.element(by.css('.cam-nav .app-switch .admin'));
};
Header.prototype.cockpitLink = function() {
  return this.node.element(by.css('.cam-nav .app-switch .cockpit'));
};
Header.prototype.tasklistLink = function() {
  return this.node.element(by.css('.cam-nav .app-switch .tasklist'));
};

function Page() { }

Page.prototype.variable = function(identifier) {
  return new Header(element(by.css(identifier)));
};


module.exports = new Page();
