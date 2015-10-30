var app = angular.module('main');

app.controller('navigationCtrl', navigationCtrl);
navigationCtrl.$inject = ['$scope', 'configTableRepo'];

function navigationCtrl($scope, configTableRepo) {

    $scope.init = function() {
        $scope.configAvailable = false;
        checkConfigAvailable();
    };

    function checkConfigAvailable(){
        configTableRepo.list().then(function(data) {
            if(data.dev){
                $scope.configAvailable= true;
            }
        },
        function(err) {
        });
    }

}
