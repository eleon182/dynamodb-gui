(function() {
    'use strict';

    angular.module('main').factory('serviceHealthRepo', serviceHealthRepo);
    serviceHealthRepo.$inject = ['abstractRepo', '$http', '$q'];

    function serviceHealthRepo(abstractRepo, $http, $q) {
        // Define the functions and properties to reveal.
        return {
            getTimeline: getTimeline
        };

        function getTimeline() {
            var params = {
                url: '/api/servicehealth',
            };
            return abstractRepo.apiTokenCall(params);
        }
    }
})();
