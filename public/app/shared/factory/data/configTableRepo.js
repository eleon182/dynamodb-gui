(function() {

    'use strict';

    angular.module('main').factory('configTableRepo', configTableRepo);
    configTableRepo.$inject = ['abstractRepo', '$http', '$q'];

    function configTableRepo(abstractRepo, $http, $q) {

        // Define the functions and properties to reveal.
        return {
            list:list
        };

        function list() {
            var settings = {
                url: '/api/configtable/',
                cache: true
            };
            return abstractRepo.apiCall(settings);
        }
    }

})();
