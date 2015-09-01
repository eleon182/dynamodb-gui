(function() {

    'use strict';

    angular.module('main').factory('abstractRepo', abstractRepo);
    abstractRepo.$inject = ['$http', '$q', '$window'];

    function abstractRepo($http, $q, $window) {
        // Define the functions and properties to reveal.
        var cache = {};
        var service = {
            apiCall: apiCall,
        };
        return service;

        function apiCall(params) {
            var q = $q.defer();
            if (cache[params.url] && params.cache === true) {
                q.resolve(cache[params.url]);
            } else {

                if (!params.method) {
                    params.method = 'GET';
                }
                if (!params.headers) {
                    params.headers = {};
                }
                params.headers['Content-Type'] = 'application/json';
                $http(params).
                success(function(data, status, headers, config) {
                    cache[params.url] = data;
                    q.resolve(data);
                }).
                error(function(data, status, headers, config) {
                    q.reject(data);
                });

            }
            return q.promise;
        }
    }

})();
