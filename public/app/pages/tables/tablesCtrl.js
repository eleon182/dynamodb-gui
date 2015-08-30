var app = angular.module('main');

app.controller('homeCtrl', homeCtrl);
homeCtrl.$inject = ['$scope', '$q'];

function homeCtrl($scope, $q) {
    $scope.init = function() {
    };

}
