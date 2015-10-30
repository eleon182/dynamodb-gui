var app = angular.module('main');

app.controller('configTableCtrl', configTableCtrl);
configTableCtrl.$inject = ['$timeout', '$scope', '$q', 'configTableRepo', 'readRepo', '$location'];

function configTableCtrl($timeout, $scope, $q, configTableRepo, readRepo, $location) {

    $scope.init = function() {
        $scope.env = 'dev';
        $scope.loadTable = loadTable;
        $scope.loadEnv= loadEnv;
        $scope.configTableList = [];
        $scope.masterData = [];
        $scope.serviceList = [];
        loadData();
    };

    function loadData(){
        NProgress.inc();
        configTableRepo.list().then(function(data) {
            $scope.masterData = data;
            loadEnv($scope.env);
            NProgress.done();
        },
        function(err) {
            NProgress.done();
        });
    }

    function loadEnv(env){
        $scope.configTableList = $scope.masterData[env];
        $scope.serviceList = [];
        $scope.serviceList.push({service:"All"});
        $scope.serviceList = $scope.serviceList.concat($scope.configTableList);
        $scope.selectedService = "All";
    }

    function loadTable(table){
        $location.path('read/').search({table: table});
    }

}
