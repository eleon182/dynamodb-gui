var app = angular.module('main');

app.controller('favoriteCtrl', favoriteCtrl);
favoriteCtrl.$inject = ['$timeout', '$scope', '$q', 'favoriteRepo', 'readRepo', '$location'];

function favoriteCtrl($timeout, $scope, $q, favoriteRepo, readRepo, $location) {

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
        NProgress.inc();
        favoriteRepo.deleteItem({table:table}).then(function(){
            NProgress.done();
            loadData();
        },
        function(){
            NProgress.done();
            loadData();
        });
    }
    function loadTable(table){
        $location.path('read/').search({table: table});
    }

}
