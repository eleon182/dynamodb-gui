var app = angular.module('main');

app.controller('forgotPasswordCtrl', forgotPasswordCtrl);
forgotPasswordCtrl.$inject = ['accountRegistrationRepo', 'profileRepo', '$location', '$scope', '$http', '$timeout', '$q'];

function forgotPasswordCtrl(accountRegistrationRepo, profileRepo, $location, $scope, $http, $timeout, $q) {
    $scope.init = function() {
        $scope.resetPassword = resetPassword;
        $scope.form = {
            username: ''
        };
    };

    function resetPassword() {
        if ($scope.form.username.length < 3) {
            bootbox.alert('Enter a valid username', function() {
                return;
            });
        } else {
            NProgress.inc();
            accountRegistrationRepo.resetPassword($scope.form).then(function() {
                NProgress.done();
                bootbox.alert('Check slack messages to complete password reset', function() {
                    return;
                });

            }, function() {
                NProgress.done();
                bootbox.alert('Invalid username. Please enter a valid slack username or contact administrator', function() {
                    return;
                });

            });
        }
    }
}
