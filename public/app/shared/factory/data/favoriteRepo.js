(function() {

    'use strict';

    angular.module('main').factory('favoriteRepo', favoriteRepo);
    favoriteRepo.$inject = ['abstractRepo', '$http', '$q'];

    function favoriteRepo(abstractRepo, $http, $q) {

        // Define the functions and properties to reveal.
        return {
            listFavorites: listFavorites,
            deleteItem: deleteItem,
            add: add
        };

        function listFavorites() {
            var settings = {
                url: '/api/favorite/list',
            };
            return abstractRepo.apiCall(settings);
        }

        function deleteItem(params) {
            var settings = {
                url: '/api/favorite/delete?table=' + params.table,
            };
            return abstractRepo.apiCall(settings);
        }
        function add(params) {
            var settings = {
                url: '/api/favorite/add?table=' + params.table,
            };
            return abstractRepo.apiCall(settings);
        }
    }

})();
