var app = angular.module('main', [
    // Angular modules
    'ngAnimate', // animations
    'ngRoute', // routing
    'ngSanitize',
    'ui.grid',
    'ui.grid.selection',
    'ui.grid.cellNav'
]);

app.run(['$q', '$rootScope',
    function($q, $rootScope) {

    }
]);

// Collect the routes
app.constant('myroutes', getRoutes());
// Configure the routes and route resolvers
app.config(['$routeProvider', 'myroutes', routeConfigurator]);

function routeConfigurator($routeProvider, routes) {

    routes.forEach(function(r) {
        $routeProvider.when(r.url, r.config);
    });
    $routeProvider.otherwise({
        redirectTo: '/'
    });
}

function getRoutes() {
    return [];
}
