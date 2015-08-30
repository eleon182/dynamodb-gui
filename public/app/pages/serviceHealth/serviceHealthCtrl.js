var app = angular.module('main');

app.controller('serviceHealthCtrl', serviceHealthCtrl);
serviceHealthCtrl.$inject = ['$window', 'serviceHealthRepo', '$scope', '$http', '$timeout', '$q'];

function serviceHealthCtrl($window, serviceHealthRepo, $scope, $http, $timeout, $q) {
    var masterList = [];

    $scope.init = function() {
        NProgress.inc();
        $scope.env = 'dev';
        $scope.displayDetails = false;
        $scope.loadEnv = loadEnv;
        $scope.showDetails = showDetails;
        $scope.serviceList = [];
        initializeList($scope.env);
    };

    function showDetails(service) {

        $scope.displayDetails = true;

        $scope.details = {
            service: service.service,
            list: []
        };

        masterList.forEach(function(val) {
            if (val.domain === service.domain && val.service === service.service) {
                $scope.details.list.push(val);
            }
        });
        $scope.details.list.sort(function(a, b) {
            //Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.date) - new Date(a.date);
        });
    }

    function initializeList(env) {
        serviceHealthRepo.getTimeline().then(function(data) {
            masterList = data;
            loadEnv(env);
            NProgress.done();
        });
    }

    function loadEnv(env) {
        $scope.serviceList = [];
        var temp = {};
        masterList.forEach(function(val) {
            if (val.domain === env) {
                if (!temp[val.service]) {
                    temp[val.service] = JSON.parse(JSON.stringify(val));
                    temp[val.service].count = 1;
                    temp[val.service].success = 0;
                    temp[val.service].fail = 0;
                    if (val.status === 'OK') {
                        temp[val.service].success++;
                    } else {
                        temp[val.service].fail++;
                    }
                } else {
                    temp[val.service].count++;
                    if (val.status === 'OK') {
                        temp[val.service].success++;
                    } else {
                        temp[val.service].fail++;
                    }
                    if (new Date(temp[val.service].date) < new Date(val.date)) {
                        temp[val.service].date = val.date;
                        temp[val.service].username = val.username;
                        temp[val.service].status = val.status;
                        temp[val.service].entryId = val.entryId;
                    }
                }
            }
        });
        for (var key in temp) {
            $scope.serviceList.push(temp[key]);
        }
        $scope.serviceList.sort(function(a, b) {
            //Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.date) - new Date(a.date);
        });
    }
}
