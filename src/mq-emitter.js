/**
 * A simple signal emitter wrapped into angular
 */

'use strict';
angular.module('mq-emitter', [])

.factory('mqEmitter', function() {

  function hasListener(listeners, signal, handler) {
    return listeners[signal] ?
      listeners[signal].indexOf(handler) !== -1 :
      false;
  }

  return {
    new: function() {
      return Object.create(this).init();
    },

    init: function() {
      this._listeners = Object.create(null);
      return this;
    },

    listenersCount: function(signal) {
      var list = this._listeners[signal];
      return  list ? list.length : 0;
    },

    on: function(signal, listener) {
      var list = this._listeners;

      if (!list[signal])
        list[signal] = [];

      if (hasListener(list, signal, listener))
        return;

      list.push(listener);
    },

    off: function(signal, listener) {
      var list = this._listeners[signal];
      if (!list)
        return;

      var index = list.indexOf(listener);
      if (index !== -1)
        list.splice(index, 1);
    },

    once: function(signal, listener) {
      var self = this;
      this.on(signal, function wrapper() {
        self.off(signal, wrapper);
        listener.apply(this, arguments);
      });
    },

    emit: function(signal /*, var_args*/) {
      var list = this._listeners[signal];
      if (!list)
        return;

      var args = Array.prototype.slice.call(arguments, 1);
      list.forEach(function(listener) {
        listener.apply(null, args);
      });
    }
  };
});
