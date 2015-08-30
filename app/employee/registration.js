// 3rd party libraries
var q = require('q');
var async = require('async');
var lo = require('lodash');
var debug = require('debug')('main');

// private libraries
var slack = require('../slackApi');
var db = require('./data/employeedb');

module.exports = registration;

function registration(params) {
    var deferred = q.defer();
    if (!(params && params.username && params.password && params.firstName && params.lastName)) {
        deferred.reject({
            code: 'missingFields',
            description: 'Required fields: username, password, firstname, lastName'
        });
    } else {
        db.getItem(params.username).then(function() {
            deferred.reject({
                code: 'usernameTaken',
                description: 'User has already registered'
            });
        }, function() {
            db.putItem(params).then(function(data) {
                    deferred.resolve(data);
                },
                function(err) {
                    deferred.reject({
                        code: 'dataError',
                        description: 'Database entry error'
                    });
                });
        });
    }
    return deferred.promise;
}
