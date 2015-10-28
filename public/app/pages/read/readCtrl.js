var app = angular.module('main');

app.controller('readCtrl', readCtrl);
readCtrl.$inject = ['dynamicDataCompiler', '$scope', '$q', 'readRepo', '$location', '$window'];

function readCtrl(dynamicDataCompiler, $scope, $q, readRepo, $location, $window) {
    $scope.init = function() {
        loadGridParameters();
        $scope.loading = true;
        $scope.tableName= '';
        var params = $location.search();
        if(params.table){
            loadData(params.table);
        }
        else {
            $location.path('tables');
        }
    };

    function loadData(table) {
        NProgress.inc();

        readRepo.scan({table:table}).then(function(data) {
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
                    $window.open("data:text/html," + encodeURIComponent(data), "jsonData", "");
                });
            }
        };
    }
}
