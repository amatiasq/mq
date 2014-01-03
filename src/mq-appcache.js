'use strict';
angular.module('mq-appcache', [])

.directive('manifest', function() {
  return {
    compile: function() {
      if (window.applicationCache) {
        applicationCache.addEventListener('updateready', function() {
          console.log('New version downloaded, reload to see the changes.');
        });
      }
    }
  };
})

.directive('mqAppcacheUpdate', function($window, $document) {
  return {
    restrict: 'EA',
    compile: function(elem) {
      elem.addClass('ng-hide');
      if (window.applicationCache) {
        applicationCache.addEventListener('updateready', function() {
          elem.removeClass('ng-hide');
          $document.find('body').addClass('mq-appcache-update');
        });
      }

      elem.on('click', function() {
        $window.location.reload();
      });
    }
  };
})

;
