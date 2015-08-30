var app = angular.module('main');

app.controller('profileCtrl', profileCtrl);
profileCtrl.$inject = ['$window', 'profileRepo', '$location', '$scope', '$http', '$timeout', '$q'];

function profileCtrl($window, profileRepo, $location, $scope, $http, $timeout, $q) {
    $scope.init = function() {
        profileRepo.getName().then(function(val) {
            $scope.user = val;
        }, function(err) {
            $scope.user = {
                firstName: '',
                lastName: '',
                username: ''
            };
        });
        $scope.form = {
            oldPassword: '',
            confirmPassword: '',
            newPassword: ''
        };
        $scope.changePassword = changePassword;
    };

    function changePassword() {
        if ($scope.form.oldPassword === '' ||
            $scope.form.confirmPassword === '' ||
            $scope.form.newPassword === '') {
            bootbox.alert('All fields are required', function() {
                return;
            });
        } else if ($scope.form.newPassword.length < 5) {
            bootbox.alert('Password must be at least 5 characters', function() {
                return;
            });
        } else if ($scope.form.newPassword !== $scope.form.confirmPassword) {
            bootbox.alert('Passwords do not match!', function() {
                return;
            });
        } else {
            profileRepo.updatePassword($scope.form).then(
                function(val) {
                    bootbox.alert('Password successfully changed!', function() {
                        $window.location.href = '#/home';
                        return;
                    });
                },
                function(err) {

                    bootbox.alert('Incorrect password entered', function() {
                        return;
                    });
                });
        }
    }

}
