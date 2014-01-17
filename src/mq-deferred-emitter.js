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
    implement: function(target) {
      var emitter = this.new();
      target.emitter = emitter;
      target.on = delegate('emitter', 'on');
      target.off = delegate('emitter', 'off');
      target.once = delegate('emitter', 'once');
      target.when = delegate('emitter', 'when');
      target.onceWhen = delegate('emitter', 'onceWhen');
      return target;
    },

    new: function() {
      return Object.create(this).init();
    },

    init: function() {
      this._emitter = mqEmitter.new();
      this._history = Object.create(null);
      return this;
    },

    bind: function(target) {
      target.when = this.when.bind(this);
      target.onceWhen = this.onceWhen.bind(this);
      return this._emitter.bind(target);
    },

    emit: function(signal) {
      var args = Array.prototype.slice.call(arguments, 1);
      if (!this._history[signal])
        this._history[signal] = [];

      this._history[signal].push(args);
      this._emitter.emit.apply(this._emitter, arguments);
    },

    when: function(signal, listener) {
      this._emitter.on(signal, listener);
      var history = this._history[signal];

      if (!history)
        return;

      var invoke = listener.apply.bind(listener, null);
      setTimeout(history.forEach.bind(history, invoke), 0);
    },

    onceWhen: function(signal, listener) {
      var history = this._history[signal];

      if (!history)
        return this._emitter.once(signal, listener);

      var lastInvocation = history[history.length - 1];
      var invoke = listener.apply.bind(listener, null, lastInvocation);
      setTimeout(invoke, 0);
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
