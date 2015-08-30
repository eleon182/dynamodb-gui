// 3rd party libraries
var q = require('q');
var async = require('async');
var bcrypt = require('bcrypt');
var lo = require('lodash');
var debug = require('debug')('main');

// private libraries
var db = require('./data/employeedb');
var utility = require('./utility');

module.exports = activate;

function activate(params) {
    var deferred = q.defer();
    if (!(params.username && params.token)) {
        deferred.reject({
            code: 'missingFields',
            description: 'Required fields: username, token'
        });
    } else {
        db.getItem(params.username).then(function(data) {
            debug('employee activate', data, params);
            if (params.token === data.customerId) {
                params.active = true;
                utility.updateStatus(params).then(function(val) {
                        deferred.resolve();
                    },
                    function(err) {
                        deferred.reject({
                            code: 'dataError',
                            description: 'Status update error'
                        });
                    }
                );
            } else {
                deferred.reject({
                    code: 'tokenError',
                    description: 'Invalid Token'
                });
            }
        }, function() {
            deferred.reject({
                code: 'invalidUsername',
                description: 'Username not found'
            });
        });
    }
    return deferred.promise;
}
