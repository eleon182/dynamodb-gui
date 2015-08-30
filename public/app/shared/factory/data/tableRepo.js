(function() {

    'use strict';

    angular.module('main').factory('tableRepo', tableRepo);
    tableRepo.$inject = ['abstractRepo', '$http', '$q'];

    function tableRepo(abstractRepo, $http, $q) {

        // Define the functions and properties to reveal.
        return {
            listTables: listTables,
            getDetails: getDetails
        };

        function listTables() {
            var settings = {
                url: '/api/table/list'
            };
            return abstractRepo.apiCall(settings);
        }

        function getDetails(table) {
            var settings = {
                url: '/api/table/describe?table=' + table
            };
            return abstractRepo.apiCall(settings);
        }
    }

})();
