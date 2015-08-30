(function() {

    'use strict';

    angular.module('main').factory('abstractRepo', abstractRepo);
    abstractRepo.$inject = ['$http', '$q', '$window'];

    function abstractRepo($http, $q, $window) {
        // Define the functions and properties to reveal.
        var service = {
            apiCall: apiCall,
            apiTokenCall: apiTokenCall
        };
        return service;

        function apiCall(params) {
            var q = $q.defer();
            if (!params.url) {
                deferred.reject();
                $window.location.href = '#/signedOut';
            } else {
                if (!params.method) {
                    params.method = 'GET';
                }
                if (!params.headers) {
                    params.headers = {};
                }
                params.headers['Content-Type']= 'application/json';
                $http(params).
                success(function(data, status, headers, config) {
                    q.resolve(data);
                }).
                error(function(data, status, headers, config) {
                    q.reject(data);
                });
            }
            return q.promise;
        }

        function apiTokenCall(params) {
            var token = sessionStorage.getItem('token');
            var q = $q.defer();
            if (!token || !params.url) {
                q.reject();
                bootbox.alert('Authorization token not found. Please log back in.', function() {
                    $window.location.href = '#/signedOut';
                    return;
                });
            } else {
                if (!params.headers) {
                    params.headers = {};
                }
                if (!params.method) {
                    params.method = 'GET';
                }
                params.headers.Authorization = token;
                params.headers['Content-Type']= 'application/json';
                $http(params).
                success(function(data, status, headers, config) {
                    q.resolve(data);
                }).
                error(function(data, status, headers, config) {
                    if (status === 401 && data.code === 'invalidToken') {
                        sessionStorage.removeItem('token');
                        bootbox.alert('Session expired. Please log back in.', function() {
                            $window.location.href = '#/';
                            return;
                        });
                    }
                    q.reject(data);
                });
            }
            return q.promise;
        }
    }

})();
