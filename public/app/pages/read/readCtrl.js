var app = angular.module('main');

app.controller('readCtrl', readCtrl);
readCtrl.$inject = ['dynamicDataCompiler', '$scope', '$q', 'readRepo'];

function readCtrl(dynamicDataCompiler, $scope, $q, readRepo) {
    $scope.init = function() {
        $scope.tableList = [];
        $scope.loading = true;
        $scope.masterTableList = [];
        $scope.tableName= '';
        $scope.loadData= loadData;
    };

    function loadData() {
        NProgress.inc();

        readRepo.scan({table:$scope.tableName}).then(function(data) {
                var test = dynamicDataCompiler.tableView(data);
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
    }
}
