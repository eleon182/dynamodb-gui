(function() {

    'use strict';

    angular.module('main').factory('dynamicDataCompiler', dynamicDataCompiler);
    dynamicDataCompiler.$inject = [ '$http', '$q'];

    function dynamicDataCompiler($http, $q) {

        // Define the functions and properties to reveal.
        return {
            tableView: tableView
        };

        function tableView(data) {
            var response = {

            };
            return;
        }
    }

})();
