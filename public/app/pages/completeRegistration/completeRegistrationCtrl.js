var app = angular.module('main');

app.controller('completeRegistrationCtrl', completeRegistrationCtrl);
completeRegistrationCtrl.$inject = ['accountRegistrationRepo', '$location', '$scope', '$http', '$timeout', '$q'];

function completeRegistrationCtrl(accountRegistrationRepo, $location, $scope, $http, $timeout, $q) {
    $scope.init = function() {
        var params = $location.search();
        if(!params.token || !params.username){
            $scope.error = true;
        }
        else {
            NProgress.inc();
            accountRegistrationRepo.submitActivation(params).then(function(val){
                $scope.success = true;
                NProgress.done();
            },
            function(err){
                $scope.error = true;
                NProgress.done();
            });
        }

    };

}
