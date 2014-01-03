/**
 * A signal emitter than allows also to listen to past events using .when()
 * Warning: it stores every emision, be aware of the memory impact this can have
 *   you can flush the memory using .flush([event])` method.
 */

'use strict';
angular.module('mq-deferred-emitter', [
  'mq-utils',
  'mq-emitter',
])

.factory('mqDeferredEmitter', function(delegate, mqEmitter) {
  return {
    new: function() {
      return Object.create(this).init();
    },

    init: function() {
      this._emitter = mqEmitter.new();
      this._history = Object.create(null);
      return this;
    },

    emit: function(signal) {
      this._emitter.emit.apply(this._emitter, arguments);
      var args = Array.prototype.slice.call(arguments, 1);

      if (!this._history[signal])
        this._history[signal] = [];

      this._history[signal].push(args);
    },

    when: function(signal, listener) {
      this._emitter.on(signal, listener);
      var history = this._history[signal];

      if (!history)
        return;

      var invoke = listener.apply.bind(listener, null);
      setTimeout(history.forEach.bind(history, invoke), 0);
    },

    flush: function(event) {
      if (event)
        this._history[event] = [];
      else
        this._history = Object.create(null);
    },

    on: delegate('_emitter', 'on'),
    off: delegate('_emitter', 'off'),
    once: delegate('_emitter', 'once'),
  };
})

;
