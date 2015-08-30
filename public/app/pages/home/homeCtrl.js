var app = angular.module('main');

app.controller('homeCtrl', homeCtrl);
homeCtrl.$inject = ['loggingRepo', 'statCompiler', 'usersRepo', 'starRepo', '$scope', '$http', '$timeout', '$q'];

function homeCtrl(loggingRepo, statCompiler, usersRepo, starRepo, $scope, $http, $timeout, $q) {
    $scope.init = function() {
        $scope.userList = [];
        NProgress.inc();
        loadUserData();
        loadHighCharts();
    };

    function loadUserData() {
        usersRepo.getUsers().then(function(data) {
            $scope.stats = statCompiler.userStats(data);
            NProgress.done();
        });
    }

    function compileTimelineData(data) {
        var temp = {};
        var response = {
            max: 0,
            series: []
        };

        data.forEach(function(val) {
            if (!temp[val.env]) {
                temp[val.env] = [];
            }
            var date = new Date(val.date).getTime() - 25200000;

            temp[val.env].push([date, parseInt(val.status)]);
        });
        for (var key in temp) {
            temp[key].sort(function(a,b) {
                return a[0] - b[0];
            });
            response.series.push({
                name: key,
                data: temp[key]
            });
            if (temp[key].length > response.max) {
                response.max = temp[key].length;
            }

        }
        return response;
    }

    function loadHighCharts() {
        loggingRepo.getTimeline().then(function(data) {
            var stats = compileTimelineData(data);

            $('#line-graph').highcharts({
                chart: {
                    type: 'spline',
                    zoomType: 'x'
                },
                title: {
                    text: 'User Health History'
                },
                subtitle: {
                    text: 'Total Readings: ' + stats.max
                },
                xAxis: {
                    type: 'datetime',
                    title: {
                        text: 'Date'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Health (percentage)'
                    },
                    min: -1,
                    max: 101
                },
                plotOptions: {
                    spline: {
                        marker: {
                            enabled: true
                        }
                    }
                },
                series: stats.series
            });
        });
    }
}
