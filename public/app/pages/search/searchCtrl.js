var app = angular.module('main');

app.controller('searchCtrl', searchCtrl);
searchCtrl.$inject = ['starRepo', '$scope', '$http', '$timeout', '$q'];

function searchCtrl(starRepo, $scope, $http, $timeout, $q) {

    $scope.init = function() {
        $scope.findUsers = findUsers;
        $scope.name = '';
        $scope.users = [];
        $scope.showAnswers = showAnswers;
    };

    function showAnswers(ssn) {
        NProgress.inc();
        starRepo.getAnswers(ssn).then(function(user) {
            var answers = '';
            if (user.oowAnswers.length === 0) {
                bootbox.alert('No Answers Found');
            } else {
                user.oowAnswers.forEach(function(val) {
                    answers += val + '<br>';
                });
            }
            NProgress.done();
            bootbox.alert(answers);
        }, function(err) {
            NProgress.done();
            bootbox.alert('Not Found');
        });
    }

    function loadDatabase() {
        $scope.users = [];
        NProgress.inc();
        $scope.loading= true;
        starRepo.getAll().then(function(users) {
            $scope.users = users;
            $scope.loading= false;
            NProgress.done();
        });
    }

    function findUsers() {
        NProgress.inc();
        $scope.users = [];
        if ($scope.name.length > 0) {
            starRepo.findUsers($scope.name).then(function(users) {
                $scope.users = users;

                NProgress.done();
            });
        } else {
            loadDatabase();
        }
    }

}
