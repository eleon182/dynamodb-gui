var app = angular.module('main', [
    // Angular modules
    'ngAnimate', // animations
    'ngRoute', // routing
    'ngSanitize',

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
    return [{
        url: '/',
        config: {
            title: 'Login',
            templateUrl: '/app/pages/login/login.html'
        }
    }, {
        url: '/completeResetPassword',
        config: {
            title: 'Complete Forgot password',
            templateUrl: '/app/pages/completeResetPassword/completeResetPassword.html'
        }
    }, {
        url: '/forgotPassword',
        config: {
            title: 'Forgot password',
            templateUrl: '/app/pages/forgotPassword/forgotPassword.html'
        }
    }, {
        url: '/signedOut',
        config: {
            title: 'Signed Out',
            templateUrl: '/app/pages/signedOut/signedOut.html'
        }
    }, {
        url: '/profile',
        config: {
            title: 'My Profile',
            templateUrl: '/app/pages/profile/profile.html'
        }
    }, {
        url: '/completeRegistration',
        config: {
            title: 'Complete Registration',
            templateUrl: '/app/pages/completeRegistration/completeRegistration.html'
        }
    }, {
        url: '/home',
        config: {
            title: 'Home',
            templateUrl: '/app/pages/home/home.html'
        }
    }, {
        url: '/search',
        config: {
            title: 'Search',
            templateUrl: '/app/pages/search/search.html'
        }
    }, {
        url: '/oow',
        config: {
            title: 'OOW Answers',
            templateUrl: '/app/pages/oow/oow.html'
        }
    }, {
        url: '/serviceHealth',
        config: {
            title: 'Service Health',
            templateUrl: '/app/pages/serviceHealth/serviceHealth.html'
        }
    }, {
        url: '/registration',
        config: {
            title: 'Create Users',
            templateUrl: '/app/pages/registration/registration.html'
        }
    }, {
        url: '/userdb',
        config: {
            title: 'User Database',
            templateUrl: '/app/pages/userdb/userdb.html'
        },
    }, {
        url: '/istanbul',
        config: {
            title: 'Istanbul',
            templateUrl: '/app/pages/istanbul/istanbul.html'
        },
    }];
}
