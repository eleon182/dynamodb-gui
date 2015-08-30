// 3rd party libraries
var q = require('q');
var async = require('async');
var bcrypt = require('bcrypt');
var lo = require('lodash');
var debug = require('debug')('main');

// private libraries
var db = require('./data/employeedb');

module.exports = validate;

function validate(params) {
    var deferred = q.defer();
    if (!(params.username && params.password)) {
        deferred.reject({
            code: 'missingFields',
            description: 'Required fields: username, password'
        });
    } else {
        db.getItem(params.username).then(function(data) {
            if (bcrypt.compareSync(params.password, data.password)) {
                if (data.active) {
                    deferred.resolve();
                } else {
                    deferred.reject({
                        code: 'accountNotActive',
                        description: 'Account has not been activated'
                    });
                }
            } else {
                deferred.reject({
                    code: 'invalidCredentials',
                    description: 'User credentials do not match'
                });
            }
        }, function() {
            deferred.reject({
                code: 'invalidCredentials',
                description: 'User credentials do not match'
            });
        });
    }
    return deferred.promise;
}
