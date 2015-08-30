// 3rd party libraries
var q = require('q');
var lo = require('lodash');
var debug = require('debug')('main');

// private libraries
var common = require('../common');
var config = require('./content/config');
var db = require('./data/servicedb');
var users = require('../users');

module.exports = {
    checkService: checkService,
};

var oauthStatus = {};

function checkService() {
    var deferred = q.defer();
    debug('running random service check');
    users.data.usersdb.getRandomUser().then(function(data) {
        var params = {
            domain: data.env,
            username: data.username
        };
        common.tokenService.getMemberToken(params).then(function(token) {
            if (oauthStatus[data.env]) {
                oauthStatus[data.env].error = false;
                db.putItem({
                    service: '/api/oauth/token',
                    username: params.username,
                    domain: params.domain,
                    status: 'OK'
                });
            }
            var path = config.getRandomService();
            httpSettings = {
                path: path,
                host: common.config.getDomain(params.domain),
                method: 'GET',
            };
            common.httpService.httpCallToken(httpSettings, token).then(function(data) {
                var input = {
                    service: path,
                    username: params.username,
                    domain: params.domain,
                    status: 'OK'
                };
                db.putItem(input);
                deferred.resolve(input);

            }, function(err) {
                db.putItem({
                    service: path,
                    username: params.username,
                    domain: params.domain,
                    status: 'FAIL'
                });
                deferred.reject(err);
            });
        }, function(err) {
            if (err.data.errors && err.data.errors[0] && err.data.errors[0].code && err.data.errors[0].code === 'user_locked') {
                deferred.reject(err);
            } else {
                oauthStatus[data.env].error = true;
                db.putItem({
                    service: '/api/oauth/token',
                    username: params.username,
                    domain: params.domain,
                    status: 'FAIL'
                });
                deferred.reject(err);
            }
        });
    });
    return deferred.promise;
}
