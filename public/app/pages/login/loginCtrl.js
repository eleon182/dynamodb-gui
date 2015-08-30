var app = angular.module('main');

app.controller('loginCtrl', loginCtrl);
loginCtrl.$inject = ['$location', '$window', 'accountRegistrationRepo', 'loginRepo', '$scope', '$http', '$timeout', '$q'];

function loginCtrl($location, $window, accountRegistrationRepo, loginRepo, $scope, $http, $timeout, $q) {
    $scope.init = function() {
        NProgress.done();
        $scope.registration = {
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            username: '',
        };
        $scope.submitRegistration = submitRegistration;
        $scope.submitLogin = submitLogin;
        if (sessionStorage.getItem('token')) {
            sessionStorage.removeItem('tokne');
        }
    };

    function submitLogin() {
        if ($scope.login.username === '' ||
            $scope.login.password === '') {
            bootbox.alert('All fields are required', function() {
                return;
            });
        } else {
            NProgress.inc();
            loginRepo.getToken($scope.login).then(function(val) {
                    NProgress.done();
                    sessionStorage.setItem('token', val.token);

                    var nextUrl = $location.search();
                    if (nextUrl.next){
                        $window.location.href = '#/' + nextUrl.next;
                    } else {
                        $window.location.href = '#/home';
                    }
                },
                function(err) {
                    NProgress.done();
                    bootbox.alert('Invalid credentials.', function() {
                        return;
                    });
                });
        }
    }

    function submitRegistration() {
        if ($scope.registration.firstName === '' ||
            $scope.registration.lastName === '' ||
            $scope.registration.password === '' ||
            $scope.registration.confirmPassword === '' ||
            $scope.registration.username === '') {
            bootbox.alert('All fields are required', function() {
                return;
            });
        } else if ($scope.registration.password.length < 5) {
            bootbox.alert('Password must be at least 5 characters', function() {
                return;
            });
        } else if ($scope.registration.password !== $scope.registration.confirmPassword) {
            bootbox.alert('Passwords do not match!', function() {
                return;
            });
        } else {
            NProgress.inc();
            accountRegistrationRepo.submitRegistration($scope.registration).then(
                function(val) {
                    NProgress.done();
                    bootbox.alert('Registration submitted! Please go to your slack messages to complete activation.', function() {
                        return;
                    });
                },
                function(err) {
                    NProgress.done();
                    if (err.code === 'invalidSlackUsername') {
                        bootbox.alert('Invalid username. Please be sure you are using a valid EIPI slack username. If you are not an EIPI user, please contact the administrator to be activated.', function() {
                            return;
                        });
                    } else if (err.code === 'usernameTaken') {
                        bootbox.alert('This username has already been registered. Please login or contact administrator to be activated.', function() {
                            return;
                        });
                    }
                }
            );
        }
    }
}
