// 3rd party dependencies
var debug = require('debug')('main');
var q = require('q');
var async = require('async');

// private dependencies
var httpService = require('../common/httpService');
var commonConfig = require('../common/commonConfig');
var token = require('../common/tokenService');
var config = require('./config');

module.exports = {
    get: get,
    post: post,
};

function post(params) {
    var deferred = q.defer();
    var httpSettings;
    token.getMemberToken(params).then(
        function(token) {
            httpSettings = {
                path: route,
                host: commonConfig.getDomain(params.domain),
                method: 'POST',
            };
            if(params.body) {
                httpSettings.body = params.body;
            }
            httpService.httpCallToken(httpSettings, token).then(function(data) {
                callback(data);
            }, function(err) {
                callback(err);
            });
        },
        function(err) {
                deferred.reject(err);
        });
    return deferred.promise;
}

function get(params) {
    var deferred = q.defer();
    var httpSettings;
    token.getMemberToken(params).then(
        function(token) {
            httpSettings = {
                path: route,
                host: commonConfig.getDomain(params.domain),
                method: 'GET',
            };
            httpService.httpCallToken(httpSettings, token).then(function(data) {
                callback(data);
            }, function(err) {
                callback(err);
            });
        },
        function(err) {
                deferred.reject(err);
        });
    return deferred.promise;
}
