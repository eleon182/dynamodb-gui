(function() {

    'use strict';

    angular.module('main').factory('usersRepo', usersRepo);
    usersRepo.$inject = ['abstractRepo', '$http', '$q'];

    function usersRepo(abstractRepo, $http, $q) {

        // Define the functions and properties to reveal.
        return {
            getUsers: getUsers,
            addUser: addUser,
            verifyUser: verifyUser,
            deleteUser: deleteUser,
            addNotes: addNotes,
            updateAll: updateAll,
            updateUser: updateUser
        };

        function updateAll() {
            var settings = {
                url: '/api/users/updateall'
            };
            return abstractRepo.apiTokenCall(settings);
        }

        function updateUser(data) {
            var settings = {
                url: '/api/users/updatesingle',
                method: 'post',
                data: data
            };
            return abstractRepo.apiTokenCall(settings);
        }

        function addNotes(data) {
            var settings = {
                url: '/api/users/notes',
                method: 'post',
                data: data
            };
            return abstractRepo.apiTokenCall(settings);
        }

        function verifyUser(data) {
            var settings = {
                url: '/api/users/verify',
                method: 'post',
                data: data
            };
            return abstractRepo.apiTokenCall(settings);
        }

        function deleteUser(data) {
            var settings = {
                url: '/api/users/delete',
                method: 'delete',
                data: data
            };
            return abstractRepo.apiTokenCall(settings);
        }

        function addUser(data) {
            var settings = {
                url: '/api/users',
                method: 'post',
                data: data
            };
            return abstractRepo.apiTokenCall(settings);
        }

        function getUsers(ssn) {
            var settings = {
                url: '/api/users'
            };
            return abstractRepo.apiTokenCall(settings);
        }
    }

})();
