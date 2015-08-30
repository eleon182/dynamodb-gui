(function() {
    'use strict';

    angular.module('main').factory('loggingRepo', loggingRepo);
    loggingRepo.$inject = ['abstractRepo', '$http', '$q'];

    function loggingRepo(abstractRepo, $http, $q) {

        // Define the functions and properties to reveal.
        return {
            getTimeline: getTimeline
        };

        function getTimeline() {
            var settings = {
                url: '/api/logging'
            };
            return abstractRepo.apiTokenCall(settings);
        }

    }
})();
