/**
 * A simple signal emitter wrapped into angular
 */

'use strict';
angular.module('mq-emitter', [
  'mq-utils',
])

.factory('mqEmitter', function(delegate) {

  function hasListener(listeners, signal, handler) {
    return listeners[signal] ?
      listeners[signal].indexOf(handler) !== -1 :
      false;
  }

  return {

    implement: function(target) {
      var emitter = this.new();
      target.emitter = emitter;
      target.on = delegate('emitter', 'on');
      target.off = delegate('emitter', 'off');
      target.once = delegate('emitter', 'once');
      return target;
    },

    new: function() {
      return Object.create(this).init();
    },

    init: function() {
      this._listeners = Object.create(null);
      return this;
    },

    bind: function(target) {
      target.on = this.on.bind(this);
      target.off = this.off.bind(this);
      target.once = this.once.bind(this);
      return target;
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

      list[signal].push(listener);
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
      list.concat().forEach(function(listener) {
        listener.apply(null, args);
      });
    }
  };
});
