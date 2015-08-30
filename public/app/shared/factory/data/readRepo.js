(function() {

    'use strict';

    angular.module('main').factory('readRepo', readRepo);
    readRepo.$inject = ['abstractRepo', '$http', '$q'];

    function readRepo(abstractRepo, $http, $q) {

        // Define the functions and properties to reveal.
        return {
            scan: scan
        };

        function scan(params) {
            var settings = {
                url: '/api/read/scan',
                method: 'POST',
                data: params
            };
            return abstractRepo.apiCall(settings);
        }

    }

})();
