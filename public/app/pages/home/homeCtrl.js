var app = angular.module('main');

app.controller('homeCtrl', homeCtrl);
homeCtrl.$inject = ['$timeout', '$scope', '$q', 'favoriteRepo', 'readRepo', '$location'];

function homeCtrl($timeout, $scope, $q, favoriteRepo, readRepo, $location) {

    $scope.init = function() {
        NProgress.inc();
        $scope.loadTable = loadTable;
        $scope.favoriteList = [];
        favoriteRepo.listFavorites().then(function(data) {
                $scope.favoriteList = data;
                NProgress.done();
            },
            function(err) {
                NProgress.done();
            });
    };

    function loadTable(table){
        $location.path('read/').search({table: table});
    }

}
