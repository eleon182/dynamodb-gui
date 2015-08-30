(function() {

    'use strict';

    angular.module('main').factory('accountRegistrationRepo', accountRegistrationRepo);
    accountRegistrationRepo.$inject = ['abstractRepo', '$http', '$q'];

    function accountRegistrationRepo(abstractRepo, $http, $q) {
        // Define the functions and properties to reveal.
        var service = {
            submitActivation: submitActivation,
            submitRegistration: submitRegistration,
            resetPassword: resetPassword,
            completeResetPassword: completeResetPassword
        };

        return service;

        function completeResetPassword(data) {
            var params = {
                url: '/api/employee/completeresetpassword',
                method: 'POST',
                data: data
            };
            return abstractRepo.apiCall(params);
        }
        function resetPassword(data) {
            var params = {
                url: '/api/employee/resetpassword',
                method: 'POST',
                data: data
            };
            return abstractRepo.apiCall(params);
        }

        function submitRegistration(data) {
            var params = {
                url: '/api/employee/create',
                method: 'POST',
                data: data
            };
            return abstractRepo.apiCall(params);
        }

        function submitActivation(data) {
            var params = {
                url: '/api/employee/activate',
                method: 'POST',
                data: data
            };
            return abstractRepo.apiCall(params);
        }
    }

})();
