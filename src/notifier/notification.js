/*globals Notification, Promise */

define(function(require) {
  'use strict';
  var Permission = require('./permission');
  var id = Math.random();

  return {
    new: function() {
      return Object.create(this).init();
    },

    init: function() {
      this._cache = {};
      this.prefix = id++;
      this.permission = Permission.new();
      this.requirePermission = this.requirePermission.bind(this);

      window.removeEventListener('mousemove', this.requirePermission);
      window.removeEventListener('mousedown', this.requirePermission);
      window.removeEventListener('keydown', this.requirePermission);
      return this;
    },

    requirePermission: function() {
      return this.permission.request();
    },

    forgetPermission: function() {
      this.permission.requested = false;
    },

    closeAll: function() {
      var cache = this._cache;
      Object.keys(cache).forEach(function(id) {
        cache[id].close();
        delete cache[id];
      });
    },

    notify: function(options) {
      if (this.permission.granted)
        return Promise.resolve(this._notify(options));

      this.requirePermission()
        .then(this._notify.bind(this, options));
    },

    _notify: function(options) {
      var cache = this._cache;
      var id = this.prefix + '|' + options.id;
      var focusOnClick = options.hasOwnProperty('focusOnClick') ?
        options.focusOnClick :
        true;

      if (cache[id])
        cache[id].close();

      var notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon,
        tag: id,
      });

      notification.addEventListener('click', function() {
        if (focusOnClick)
          window.focus();
      });

      notification.addEventListener('close', function() {
        if (cache[id] === notification)
          delete cache[id];
      });

      cache[id] = notification;
      return notification;
    }
  };
});

