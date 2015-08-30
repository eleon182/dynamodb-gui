var app = angular.module('main');

app.filter('dateFilter', function() {
  return function(date) {
      return new Date(date).toLocaleString();
  };
});
