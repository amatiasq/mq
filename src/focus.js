(function() {
  'use strict';

  var hasFocus = false;

  // Commented since document.visibilityState is 'visible' even if the browser
  // hasn't the focus
  //
  // var hasFocus = document.visibilityState ?
  //   document.visibilityState === 'visible' :
  //   false;

  function setFocus(value) {
    hasFocus = value;
  }
  function setTrue() {
    setFocus(true);
  }

  window.addEventListener('mousedown', setTrue);
  window.addEventListener('keydown', setTrue);
  window.addEventListener('focus', setTrue);
  window.addEventListener('blur', function() {
    setFocus(false);
  });
  document.addEventListener('visibilitychange', function() {
    setFocus(document.visibilityState === 'visible');
  });


  define(function(require) {
    var Emitter = require('./emitter');
    var exports = Emitter.new();

    exports.hasFocus = function() {
      return hasFocus;
    };

    setFocus = function(value) {
      if (value === hasFocus)
        return;

      var old = hasFocus;
      hasFocus = value;
      exports.emit('change', value, old);
    };

    return exports;
  });

})();
