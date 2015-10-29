var app = angular.module('main');

app.controller('homeCtrl', homeCtrl);
homeCtrl.$inject = ['$timeout', '$scope', '$q', 'favoriteRepo', 'readRepo', '$location'];

function homeCtrl($timeout, $scope, $q, favoriteRepo, readRepo, $location) {

    $scope.init = function() {
        $scope.loadTable = loadTable;
        $scope.deleteTable= deleteTable;
        $scope.favoriteList = [];
        loadData();
    };

    function loadData(){
        NProgress.inc();
        favoriteRepo.listFavorites().then(function(data) {
                $scope.favoriteList = data;
                NProgress.done();
            },
            function(err) {
                NProgress.done();
            });

    }

    function deleteTable(table){
        favoriteRepo.deleteItem({table:table}).then(function(){
            loadData();
        },
        function(){
            loadData();
        });
    }
    function loadTable(table){
        $location.path('read/').search({table: table});
    }

}
