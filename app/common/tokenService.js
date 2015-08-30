// 3rd party dependencies
var debug = require('debug')('main');
var q = require('q');
var querystring = require('querystring');

// private dependencies
var httpService = require('./httpService');
var config = require('./config');

// Required parameters:
// domain
function getBasicToken(params) {
    var httpSettings = {
        path: '/api/oauth/token',
        method: 'POST',
        host: config.getDomain(params.env || params.domain),
        body: querystring.stringify(config.basic.registrationToken),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    var deferred = q.defer();

    httpService.httpCall(httpSettings).then(function(response) {
        if (response && response.access_token) {
            deferred.resolve(response.access_token);
        } else {
            deferred.reject(response);
        }
    }, function(err) {
        deferred.reject(err);
    });
    return deferred.promise;
}

// Required parameters:
// username
// domain
function getMemberToken(params) {
    debug('tokenservice: getMemberToken()', params);
    var deferred = q.defer();

    config.memberToken.username = params.username;

    var httpSettings = {
        path: '/api/oauth/token',
        method: 'POST',
        body: querystring.stringify(config.memberToken),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        host: config.getDomain(params.domain)
    };
    httpService.httpCall(httpSettings).then(function(response) {
            debug('tokenService member token: ' + response);
            if (response && response.access_token) {
                deferred.resolve(response.access_token);
            } else {
                deferred.reject(response);
            }
        },
        function(err) {
            deferred.reject(err);
        });
    return deferred.promise;
}

module.exports = {
    getBasicToken: getBasicToken,
    getMemberToken: getMemberToken
};
