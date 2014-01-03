'use strict';
angular.module('mq-utils', [])

.factory('delegate', function() {
  return function delegate(property, method) {
    return function() {
      return this[property][method].apply(this[property], arguments);
    };
  };
})

;
