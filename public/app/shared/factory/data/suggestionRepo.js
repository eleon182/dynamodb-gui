(function() {

    'use strict';

    angular.module('main').factory('suggestionRepo', suggestionRepo);
    suggestionRepo.$inject = ['abstractRepo', '$http', '$q'];

    function suggestionRepo(abstractRepo, $http, $q) {

        // Define the functions and properties to reveal.
        return {
            submit: submit,
        };

        function submit(data) {
            var settings = {
                url: '/api/suggestion/create',
                method: 'post',
                data: data
            };
            return abstractRepo.apiTokenCall(settings);
        }

    }

})();
