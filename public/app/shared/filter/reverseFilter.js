var app = angular.module('cowApp');

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
