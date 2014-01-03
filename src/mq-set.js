/**
 * A collection than guarantees not repeated entries. Only strings are allowed.
 */

'use strict';
angular.module('mq-set', [
  'mq-utils',
])

.factory('mqSet', function(delegate) {
  return {
    new: function(start) {
      return Object.create(this).init(start);
    },

    get length() {
      return this.items.length;
    },

    init: function(start) {
      this.items = [];
      this._keys = Object.create(null);

      if (start)
        start.forEach(this.add.bind(this));

      return this;
    },

    has: function(key) {
      return key in this._keys;
    },

    add: function(key) {
      if (typeof key !== 'string')
        throw new Error('Set() only accepts strings as key');

      if (this.has(key))
        return false;

      this.items.push(key);
      this._keys[key] = true;
      return true;
    },

    remove: function(key) {
      if (!this.has(key))
        return false;

      var index = this.items.indexOf(key);
      this.items.splice(index, 1);
      delete this._keys[key];
      return true;
    },

    clear: function() {
      var items = this.items.slice();
      this.items.length = 0;
      this._keys = Object.create(null);
      return items;
    },

    // Delegate array methods
    join: delegate('items', 'join'),
    slice: delegate('items', 'slice'),
    concat: delegate('items', 'concat'),

    // Delegate array extras
    map: delegate('items', 'map'),
    some: delegate('items', 'some'),
    every: delegate('items', 'every'),
    filter: delegate('items', 'filter'),
    reduce: delegate('items', 'reduce'),
    forEach: delegate('items', 'forEach'),
    reduceRight: delegate('items', 'reduceRight'),
  };
});
