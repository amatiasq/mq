/**
 * A localStorage and sessionStorage wrapper than serializes to / unserializes
 *    from JSON and adds a cache layer and a few useful extra methods.
 */

'use strict';
angular.module('mq-dom-storage', [])

.factory('mqDomStorage', function() {

  function checkVersion(storage) {
    if (storage.get('@@version@@') !== storage.version) {
      storage.clear();
      storage.set('@@version@@', storage.version);
    }
  }

  return {
    new: function(options) {
      return Object.create(this).init(options || {});
    },

    init: function(options) {
      this.storage = options.session ? sessionStorage : localStorage;
      this.prefix = options.prefix || '';
      this.version = options.version || 0;
      this._cache = Object.create(null);
      checkVersion(this);
      return this;
    },

    hasCached: function(key) {
      return key in this._cache;
    },

    has: function(key) {
      return this.hasCached() || this.getKeys().indexOf(key) !== -1;
    },

    get: function(key, defaultValue) {
      if (!this.hasCached(key)) {
        var value = this.storage.getItem(this.prefix + key);

        if (value != null)
          this._cache[key] = JSON.parse(value);

        else if (arguments.length > 1)
          this._cache[key] = defaultValue;
      }

      return this._cache[key];
    },

    set: function(key, value) {
      this.storage.setItem(this.prefix + key, JSON.stringify(value));
      this._cache[key] = value;
    },

    remove: function(key) {
      this.storage.removeItem(this.prefix + key);
      delete this._cache[key];
    },

    getLength: function() {
      return this.storage.length;
    },

    getKey: function(index) {
      var key = this.storage.key(index);
      var valid = key && key.indexOf(this.prefix) === 0;
      return valid ? key.substr(this.prefix.length) : null;
    },

    getKeys: function() {
      var keys = [];
      var key;

      for (var i = 0, len = this.storage.length; i < len; i++) {
        key = this.getKey(i);
        if (key)
          keys.push(key);
      }

      return keys;
    },

    getBytes: function() {
      this.getKeys().forEach(this.get.bind(this));
      return JSON.stringify(this._cache).length;
    },

    clear: function() {
      this.getKeys().forEach(this.remove.bind(this));
    }
  };
});
