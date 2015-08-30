(function() {

    'use strict';

    angular.module('main').factory('starRepo', starRepo);
    starRepo.$inject = ['abstractRepo', '$http', '$q'];

    function starRepo(abstractRepo, $http, $q) {
        // Define the functions and properties to reveal.
        var service = {
            getAnswers: getAnswers,
            getAll: getAll,
            findUsers: findUsers,
        };
        return service;

        function getAll() {
            var params = {
                url: '/api/star/getall',
            };
            return abstractRepo.apiTokenCall(params);
        }

        function getAnswers(ssn) {
            var route = '/api/star/getanswers?ssn=' + ssn;
            var params = {
                url: route
            };
            return abstractRepo.apiTokenCall(params);
        }

        function findUsers(name) {
            var route = '/api/star/findusers?name=' + name;
            var params = {
                url: route
            };
            return abstractRepo.apiTokenCall(params);
        }
    }

})();
