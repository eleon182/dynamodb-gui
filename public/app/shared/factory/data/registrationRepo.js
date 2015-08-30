(function() {

    'use strict';

    angular.module('main').factory('registrationRepo', registrationRepo);
    registrationRepo.$inject = ['abstractRepo', '$http', '$q'];

    function registrationRepo(abstractRepo, $http, $q) {
        // Define the functions and properties to reveal.
        var service = {
            token: token,
            steps: steps
        };
        return service;

        function token(data) {
            var params = {
                url: '/api/registration/token',
                method: 'POST',
                data: data
            };
            return abstractRepo.apiTokenCall(params);
        }

        function steps(data, num) {
            var q = $q.defer();
            var route = '/api/registration/step' + num;
            var params = {
                url: route,
                method: 'POST',
                data: data
            };
            abstractRepo.apiTokenCall(params).then(function(data) {
                q.resolve(data);
            }, function(err) {
                q.resolve(err);
            });
            return q.promise;
        }
    }

})();
