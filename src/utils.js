define(function() {
  'use strict';


  function delegate(property, method) {
    return function() {
      return this[property][method].apply(this[property], arguments);
    };
  }


  return {
    delegate: delegate,
  };
});
