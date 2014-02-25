define(function(require) {
  'use strict';
  var delegate = require('./utils').delegate;
  var Emitter = require('./emitter');
  var Set = require('./set');


  function emitRemove(key) {
    // this is a private method so it can use 'this'
    //jshint validthis:true
    this.emitter.emit('remove', key);
  }


  /**
   * A collection than guarantees not repeated entries. Only strings are allowed.
   * It implements emitter so you can listen to changes
   */
  return {
    new: function(start) {
      return Object.create(this).init(start);
    },

    get length() {
      return this.set.length;
    },

    init: function(start) {
      this.emitter = Emitter.new();
      this.set = Set.new();

      if (start)
        start.forEach(this.add.bind(this));

      return this;
    },

    has: delegate('set', 'has'),

    add: function(key) {
      if (this.set.add(key)) {
        this.emitter.emit('change', this.set);
        this.emitter.emit('add', key);
      }
    },

    remove: function(key) {
      if (this.set.remove(key)) {
        this.emitter.emit('change', this.set);
        this.emitter.emit('remove', key);
      }
    },

    clear: function() {
      var items = this.set.clear();
      if (items.length) {
        this.emitter.emit('change', this.set);
        items.map(emitRemove, this);
      }
    },

    // Delegate array methods
    join: delegate('set', 'join'),
    slice: delegate('set', 'slice'),
    concat: delegate('set', 'concat'),

    // Delegate array extras
    map: delegate('set', 'map'),
    some: delegate('set', 'some'),
    every: delegate('set', 'every'),
    filter: delegate('set', 'filter'),
    reduce: delegate('set', 'reduce'),
    forEach: delegate('set', 'forEach'),
    reduceRight: delegate('set', 'reduceRight'),

    // Delegate emitter
    on: delegate('emitter', 'on'),
    off: delegate('emitter', 'off'),
    once: delegate('emitter', 'once'),
  };
});
