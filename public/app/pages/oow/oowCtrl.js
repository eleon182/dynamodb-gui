var app = angular.module('main');

app.controller('oowCtrl', oowCtrl);
oowCtrl.$inject = ['starRepo', '$scope'];

function oowCtrl(starRepo, $scope) {

    $scope.init = function() {
        $scope.getAnswers = getAnswers;
        $scope.ssn = '';
        $scope.answers = [];
    };

    function getAnswers() {
        starRepo.getAnswers($scope.ssn).then(function(user) {
            if (user.oowAnswers) {
                $scope.answers = user.oowAnswers;
            } else {
                $scope.answers = [];
                $scope.answers.push('Not Found');
            }
        }, function(err) {
            $scope.answers = [];
            $scope.answers.push('Not Found');
        });
    }

}
