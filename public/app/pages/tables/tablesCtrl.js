var app = angular.module('main');

app.controller('tablesCtrl', tablesCtrl);
tablesCtrl.$inject = ['$scope', '$q', 'tableRepo', '$location', 'favoriteRepo'];

function tablesCtrl($scope, $q, tableRepo, $location, favoriteRepo) {
    $scope.init = function() {
        $scope.tableList = [];
        $scope.loading = true;
        $scope.masterTableList = [];
        $scope.filter = '';
        $scope.filterList = filterList;
        $scope.saveFavorites= saveFavorites;
        $scope.getDetails = getDetails;
        $scope.showData= showData;
        NProgress.inc();

        tableRepo.listTables().then(function(data) {
                $scope.loading = false;
                $scope.tableList = data;
                $scope.masterTableList = data;
                NProgress.done();
            },
            function(err) {
                $scope.loading = false;
                NProgress.done();
                $scope.errorFound = err;
            });
    };

    function saveFavorites(table){
        favoriteRepo.add({table: table}).then(function(){
            $location.path('home/');
        },
        function(){

        });
    }

    function getDetails(table) {
        tableRepo.getDetails(table).then(function(data) {
            bootbox.alert(buildDetails(data), function() {
                return;
            });
        });
    }

    function showData(table){
        $location.path('read/').search({table: table});
    }

    function buildDetails(data){
        var response = '';
        response += 'Table Name: ' + data.TableName;
        response += '<br>Item Count: ' + data.ItemCount;
        response += '<br>Creation Date: ' + data.CreationDateTime;
        data.KeySchema.forEach(function(val){
            response += '<br>' + val.KeyType + ': '+ val.AttributeName;
        });

        return response;
    }

    function filterList() {
        var finalList = [];
        var splitFilter = $scope.filter.split(' ');
        var match;

        if ($scope.filter.length === 0) {
            finalList = $scope.masterTableList;
        } else {
            $scope.masterTableList.forEach(function(val) {
                match = true;
                splitFilter.forEach(function(filter) {
                    if (val.toLowerCase().indexOf(filter.toLowerCase()) === -1) {
                        match = false;
                    }
                });
                if (match) {
                    finalList.push(val);
                }
            });
        }
        $scope.tableList = finalList;
    }


}
