// 3rd party dependencies
var debug = require('debug')('main');
var q = require('q');
var async = require('async');

// private dependencies
var common = require('../../common');
var config = require('./content/config');

module.exports = {
    account: account,
    login: login,
};

function login(params) {
    debug('login: verifyAccount()', params);
    return token.getMemberToken(params);
}

function account(params) {
    debug('verify.js: verifyAccount()', params);
    var deferred = q.defer();
    var httpSettings;
    common.tokenService.getMemberToken(params).then(
        function(token) {
            debug('verify.js: verifyAccount() got token', params);
            async.reject(config.listGet,
                function(route, callback) {
                    httpSettings = {
                        path: route,
                        host: common.config.getDomain(params.domain),
                        method: 'GET',
                    };
                    common.httpService.httpCallToken(httpSettings, token).then(function(data) {
                        callback(true);
                    }, function(err) {
                        callback(false);
                    });
                },
                function(err) {
                    debug('verify.js: verifyAccount() finished verifying', err);
                    if (err.length > 0) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve();
                    }

                });
        },
        function onError(err) {
            debug('verify.js: verifyAccount() token failed', err);
            if (err.data.errors && err.data.errors[0] && err.data.errors[0].code && err.data.errors[0].code === 'user_locked') {
                deferred.reject(['OK']);
            }
            else {
                err = ['/api/oauth/token'];
                deferred.reject(err);
            }
        });
    return deferred.promise;
}
