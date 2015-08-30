(function() {
    'use strict';

    angular.module('main').factory('profileRepo', profileRepo);
    profileRepo.$inject = ['abstractRepo', '$http', '$q'];

    function profileRepo(abstractRepo, $http, $q) {

        // Define the functions and properties to reveal.
        return {
            getName: getName,
            updatePassword: updatePassword,
        };

        function updatePassword(data) {
            var settings = {
                url: '/api/profile/updatepassword',
                method: 'POST',
                data: data
            };
            return abstractRepo.apiTokenCall(settings);
        }

        function getName() {
            var settings = {
                url: '/api/profile/getName'
            };
            return abstractRepo.apiTokenCall(settings);
        }

    }
})();
