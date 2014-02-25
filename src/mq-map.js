define(function() {
  'use strict';


  function dictDelegate(method) {
    return function(iterator, scope) {
      this.keys()[method](function(key) {
        return iterator.call(scope, this._dictionary[key], key, this);
      }, this);
    };
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
      this._dictionary = Object.create(null);

      if (start)
        angular.extend(this._dictionary, start);

      return this;
    },

    has: function(key) {
      return key in this._dictionary;
    },

    get: function(key) {
      return this.has(key) ? this._dictionary[key] : null;
    },

    set: function(key, value) {
      var exists = this.has(key);
      this._dictionary[key] = value;

      if (!exists)
        this._keysCache = null;

      return !exists;
    },

    remove: function(key) {
      if (!this.has(key))
        return false;

      delete this._dictionary[key];
      this._keysCache = null;
      return true;
    },

    clear: function() {
      var dict = this._dictionary;
      this._dictionary = Object.create(null);
      return dict;
    },

    keys: function() {
      if (!this._keysCache)
        this._keysCache = Object.keys(this._dictionary);

      return this._keysCache;
    },

    values: function() {
      return this.keys().map(function(key) {
        return this._dictionary[key];
      }, this);
    },

    forEach: dictDelegate('forEach'),
    some: dictDelegate('some'),
    every: dictDelegate('every'),

    map: function(iterator, scope) {
      var result = Object.create(null);
      this.forEach(function(value, key, self) {
        result[key] = iterator.call(scope, value, key, self);
      });
      return result;
    },

    filter: function(iterator, scope) {
      var result = Object.create(null);
      this.forEach(function(value, key, self) {
        if (iterator.call(scope, value, key, self))
          result[key] = value;
      });
      return result;
    },

    reduce: function(iterator, initial) {
      this.forEach(function(value, key, self) {
        initial = iterator(initial, value, key, self);
      });
      return initial;
    },
  };
});
