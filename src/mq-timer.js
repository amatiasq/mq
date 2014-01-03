'use strict';
angular.module('mq-timer', [])

.factory('mqTimer', function($timeout) {
  return {
    new: function(action, duration, options) {
      return Object.create(this).init(action, duration, options || {});
    },

    init: function(action, duration, options) {
      this.repeat = options.repeat || false;
      this.duration = duration || 1000;
      this._tick = this._tick.bind(this);
      this._action = action;
      this._int = null;
      return this;
    },

    start: function() {
      if (this._int)
        return;

      this._int = $timeout(this._tick, this.duration);
    },

    stop: function() {
      if (!this._int)
        return;

      $timeout.cancel(this._int);
      this._int = null;
    },

    restart: function() {
      this.stop();
      this.start();
    },

    _tick: function() {
      this._int = null;
      this._action.call(null);

      if (this.repeat)
        this.start();
    },
  };
});
