var app = angular.module('main');

app.controller('signedOutCtrl', signedOutCtrl);
signedOutCtrl.$inject = ['$window', '$scope', '$http', '$timeout', '$q'];

function signedOutCtrl($window, $scope, $http, $timeout, $q) {
    $scope.init = function() {
        NProgress.done();
        sessionStorage.removeItem('token');
    };

}
