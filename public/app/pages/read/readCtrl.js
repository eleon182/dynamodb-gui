var app = angular.module('main');

app.controller('readCtrl', readCtrl);
readCtrl.$inject = ['dynamicDataCompiler', '$scope', '$q', 'readRepo', '$location', '$window', 'favoriteRepo'];

function readCtrl(dynamicDataCompiler, $scope, $q, readRepo, $location, $window, favoriteRepo) {
    $scope.init = function() {
        loadGridParameters();
        $scope.loading = true;
        $scope.tableName= '';
        $scope.refreshData = refreshData;
        $scope.saveFavorite= saveFavorite;
        var params = $location.search();
        if(params.table){
            $scope.tableName= params.table;
            loadData(params.table, false);
        }
        else {
            $location.path('tables');
        }
    };

    function saveFavorite(){
        favoriteRepo.add({table: $scope.tableName}).then(function(){
            $location.path('favorite/');
        },
        function(){

        });
    }

    function refreshData(){
        $scope.gridOptions.data = [];
        loadData($scope.tableName, true);
    }

    function loadData(table, refresh) {
        NProgress.inc();

        readRepo.scan({table:table, refresh: refresh}).then(function(data) {
            //var test = dynamicDataCompiler.tableView(data);
            $scope.loading = false;
            $scope.gridOptions.data = data;
            NProgress.done();
        },
        function(err) {
            $scope.loading = false;
            NProgress.done();
            $scope.errorFound = err;
        });
    }

    function buildJsonOutput(data){
        var response = '';
        for(var key in data){
            response += key+ ': ' + JSON.stringify(data[key])+ '<br>';
        }
        return response;
    }

    function loadGridParameters(){
        $scope.gridOptions= {
            enableSorting: true,
            enableFiltering: true,
            enableRowSelection: true,
            multiSelect : false,
            modifierKeysToMultiSelect : false,
            noUnselect : true,
            enableRowHeaderSelection: false,
            selectionRowHeaderWidth: 35,
            showGridFooter:true,
            data: [],
            onRegisterApi: function( gridApi ) {
                $scope.grid1Api = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope,function(row){
                    var output = row.entity;
                    delete output.$$hashKey;
                    var data = '<p style="white-space: pre">' + JSON.stringify(output,null,2)+ '</p>';
                    $window.open("data:text/html," + encodeURIComponent(data), "_blank", "");
                });
            }
        };
    }
}
