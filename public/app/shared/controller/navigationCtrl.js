var app = angular.module('main');

app.controller('navigationCtrl', navigationCtrl);
navigationCtrl.$inject = ['$scope', 'suggestionRepo'];

function navigationCtrl($scope, suggestionRepo) {

    $scope.init = function() {
        $scope.submitSuggestion = submitSuggestion;
    };

    function submitSuggestion() {
        bootbox.prompt({
            title: 'Enter comments or suggestions:',
            value: '',
            callback: function(result) {
                if (!result) {
                    return;
                }
                suggestionRepo.submit({
                    message: result
                });

                bootbox.alert('Thank you! Your message has been submitted', function() {
                    return;
                });

            }
        });
    }
}
