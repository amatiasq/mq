'use strict';

function settle(status, value) {
  //jshint validthis:true
  if (this.status !== 'unfulfilled') return;

  this.status = status;
  this._cbk.forEach(function(fn) {
    fn(value);
  });
}

function Promise(executor) {
  var self = this;
  this.status = 'unfulfilled';
  this._cbk = [];

  var reject = settle.bind(this, 'failed');
  function resolve(value) {

    if (value.then)
      return value.then(resolve, reject);

    settle.call(self, 'fulfilled', value);
  }

  executor(resolve, reject);
}

Promise.resolved = function(value) {
  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.rejected = function(reason) {
  return new Promise(function(resolve, reject) {
    reject(reason);
  });
};

Promise.normalize = Promise.when = function(value) {
  return value.then ? value : Promise.resolved(value);
};

function areResolved(promise) {
  return promise.isResolved();
}


Promise.all = Promise.parallel = function(promises) {
  if (!(promises instanceof Array))
    promises = Array.prototype.slice.call(arguments);

  if (!promises.length)
    return Promise.resolved([]);

  var values = [];
  return new Promise(function(resolve, reject) {

    promises = promises.map(Promise.normalize);
    promises.forEach(function(promise, index) {

      promise.then(function(value) {
        values[index] = value;

        if (promises.every(areResolved))
          resolve(values);
      }, reject);
    });
  });
};


Promise.prototype = {
  constructor: Promise,

  isResolved: function() {
    return this.status === 'fulfilled';
  },

  isRejected: function() {
    return this.status === 'failed';
  },

  isPending: function() {
    return this.status !== 'unfulfilled';
  },

  isSettled: function() {
    return !this.isPending();
  },

  then: function(resolved, rejected) {
    var self = this;
    return new Promise(function(resolve, reject) {

      function wrapper(value) {
        var isFulfilled = self.status === 'fulfilled';
        var callback = isFulfilled ? resolved : rejected;
        var operation = isFulfilled ? resolve : reject;

        if (!callback)
          return operation(value);

        if (Promise.debug)
          return operation(callback(value));

        try {
          operation(callback(value));
        } catch(err) {
          reject(err);
        }
      }

      if (this.status === 'unfulfilled')
        this._cbk.push(wrapper);
      else
        setTimeout(wrapper, 0);
    });
  },

  fin: function(handler) {
    return this.then(function(value) {
      return Promise.normalize(handler())
        .then(function() { return value });
    }, function(error) {
      return Promise.normalize(handler())
        .then(function() { return Promise.rejected(error) });
    });
  },

  spread: function(resolved, rejected) {
    if (typeof resolved !== 'function')
      return this.then(null, rejected);

    return this.then(function(array) {
      return resolved.apply(null, array);
    }, rejected);
  },

  timeout: function(milliseconds) {
    return new Promise(function(resolve, reject) {
      setTimeout(reject.bind(null, new Error('timeout')), milliseconds);
    });
  }
};
