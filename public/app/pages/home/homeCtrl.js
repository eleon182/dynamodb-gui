var app = angular.module('main');

app.controller('homeCtrl', homeCtrl);
homeCtrl.$inject = ['$timeout', '$scope', '$q', 'tableRepo', 'readRepo'];

function homeCtrl($timeout, $scope, $q, tableRepo, readRepo) {

    $scope.init = function() {
        $scope.tableList = [];
        $scope.loading = true;
        $scope.masterTableList = [];
        $scope.filter = '';
        $scope.filterList = filterList;
        $scope.getDetails = getDetails;
        NProgress.inc();
        $scope.tableGridOptions = getTableListConfig();
        $scope.tableDataGridOptions = {};
        tableRepo.listTables().then(function(data) {
                $scope.loading = false;
                $scope.masterTableList = data;
                filterList();
                NProgress.done();
            },
            function(err) {
                $scope.loading = false;
                NProgress.done();
                $scope.errorFound = err;
            });
    };

    function getTableListConfig() {
        return {
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
                gridApi.cellNav.on.navigate($scope, function(newRowCol, oldRowCol) {
                    NProgress.inc();
                    readRepo.scan({
                        table: newRowCol.row.entity.Table
                    }).then(function(data) {
                        $scope.tableDataGridOptions.columnDefs = [];
                        $scope.tableDataGridOptions.data = data;
                        NProgress.done();
                    });
                });
            }
        }
    }

    function getDetails(table) {
        tableRepo.getDetails(table).then(function(data) {
            bootbox.alert(buildDetails(data), function() {
                return;
            });
        });
    }

    function buildDetails(data) {
        var response = '';
        response += 'Table Name: ' + data.TableName;
        response += '<br>Item Count: ' + data.ItemCount;
        response += '<br>Creation Date: ' + data.CreationDateTime;
        data.KeySchema.forEach(function(val) {
            response += '<br>' + val.KeyType + ': ' + val.AttributeName;
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
        var compile = [];
        finalList.forEach(function(val) {
            compile.push({
                Table: val
            });
        })
        $scope.tableGridOptions.data = compile;
    }
}
