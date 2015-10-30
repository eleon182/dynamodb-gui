var app = angular.module('main');

app.controller('navigationCtrl', navigationCtrl);
navigationCtrl.$inject = ['$scope', 'configTableRepo'];

function navigationCtrl($scope, configTableRepo) {

    $scope.init = function() {
    };

}
