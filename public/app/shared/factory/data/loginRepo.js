(function() {

    'use strict';

    angular.module('main').factory('loginRepo', loginRepo);
    loginRepo.$inject = ['abstractRepo', '$http', '$q'];

    function loginRepo(abstractRepo, $http, $q) {
        // Define the functions and properties to reveal.
        var service = {
            getToken: getToken
        };

        return service;

        function getToken(data) {
            var params = {
                url: '/api/oauth/token',
                method: 'POST',
                data: data
            };
            return abstractRepo.apiCall(params);
        }
    }

})();
