define(function(require) {
  'use strict';
  var delegate = require('./utils').delegate;
  var Emitter = require('./emitter');
  var Map = require('./map');


  function emitRemove(key) {
    // this is a private method so it can use 'this'
    //jshint validthis:true
    this.emitter.emit('remove', key);
  }


  /**
   * A collection to store items by key value. Only strings are allowed.
   * It implements emitter so you can listen to changes
   */
  return {
    new: function(start) {
      return Object.create(this).init(start);
    },

    init: function(start) {
      this.map = Map.new();
      this.emitter = Emitter.new();

      if (start) {
        Object.keys(start).forEach(function(key) {
          this.set(key, start[key]);
        }, this);
      }

      return this;
    },

    has: delegate('map', 'has'),
    get: delegate('map', 'get'),

    set: function(key, value) {
      var isNew = this.map.set(key, value);
      this.emitter.emit('change', this.map);

      if (isNew)
        this.emitter.emit('add', key);
    },

    remove: function(key) {
      if (this.map.remove(key)) {
        this.emitter.emit('change', this.map);
        this.emitter.emit('remove', key);
      }
    },

    clear: function() {
      var removed = Object.keys(this.map.clear());

      if (removed.length) {
        this.emitter.emit('change', this.map);
        removed.forEach(emitRemove, this);
      }
    },

    keys: delegate('map', 'keys'),
    values: delegate('map', 'values'),
    forEach: delegate('map', 'forEach'),
    some: delegate('map', 'some'),
    every: delegate('map', 'every'),
    map: delegate('map', 'map'),
    filter: delegate('map', 'filter'),
    reduce: delegate('map', 'reduce'),
  };
});
