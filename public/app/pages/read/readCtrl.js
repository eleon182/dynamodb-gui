var app = angular.module('main');

app.controller('readCtrl', readCtrl);
readCtrl.$inject = ['$scope', '$q', 'readRepo'];

function readCtrl($scope, $q, readRepo) {
    $scope.init = function() {
        $scope.tableList = [];
        $scope.loading = true;
        $scope.masterTableList = [];
        $scope.filter = '';
        $scope.filterList = filterList;
        $scope.getDetails = getDetails;
        NProgress.inc();

        readRepo.scan({table:'steve-test'}).then(function(data) {
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

    function getDetails(table) {
        readRepo.getDetails(table).then(function(data) {
            bootbox.alert(buildDetails(data), function() {
                return;
            });
        })
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
