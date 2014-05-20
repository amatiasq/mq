/* globals Promise, Notification */

define(function() {
  'use strict';

  // this is a private method so it can use 'this'
  //jshint validthis:true
  function onRequestResponse(response) {
    debugger;
    response = response || Notification.permission;

    if (response === 'granted') {
      this.granted = true;
      this._resolve();
    } else if (response === 'denied') {
      this._reject(new Error('Permission denied'));
    }
  }

  function checkIfGranted(permission) {
    if (Notification.permission !== 'granted')
      return;

    permission.granted = true;
    permission._resolve()
  }


  return {
    new: function() {
      return Object.create(this).init();
    },

    init: function() {
      this.requested = false;
      this.granted = false;

      this.promise = new Promise(function(resolve, reject) {
        this._resolve = resolve;
        this._reject = reject;
      }.bind(this));

      checkIfGranted(this);
      return this;
    },

    request: function() {
      if (!this.granted && !this.requested) {
        this.requested = true;
        Notification.requestPermission(onRequestResponse.bind(this));
      }
      return this.promise;
    },
  };
});
