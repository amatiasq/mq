define(function(require) {
  'use strict';
  var Notification = require('./notifier/notification');
  var Focus = require('./focus');
  var Timer = require('./timer');

  return {
    new: function(options) {
      return Object.create(this).init(options);
    },

    init: function(options) {
      options = options || {};

      this._originalTitle = '';
      this._blinkText = options.blinkText || '';
      this.beep = new Audio(options.audio);
      this.notifications = Notification.new();

      this.blink = Timer.new(
        this.onBlink.bind(this),
        options.blinkInterval || 1000,
        { repeat: true }
      );

      Focus.on('change', function(value) {
        if (!value) return;
        this.notifications.closeAll();
        this.blink.stop();
        document.title = this._originalTitle;
      }.bind(this));

      return this;
    },

    onBlink: function() {
      document.title = document.title === this._blinkText ?
        this._originalTitle :
        this._blinkText;
    },

    notify: function(options) {
      if (Focus.hasFocus())
        return;

      if (document.title !== this._blinkText)
        this._originalTitle = document.title;

      this.beep.play();
      this.blink.start();
      this.notifications.notify(options);
    },
  };
});

