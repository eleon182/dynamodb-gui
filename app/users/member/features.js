// 3rd party dependencies
var debug = require('debug')('main');
var q = require('q');
var async = require('async');

// private dependencies
var common = require('../../common');

module.exports = {
    checkFeatures: checkFeatures
};

function compileReportHistory(data) {
    var response = false;
    data.experian.forEach(function(val) {
        if (val.type === 'ALL') {
            response = true;
        }
    });
    return response;
}

function compileAlertSummary(data) {
    return data.total > 0;
}

function compileReportScore(data) {
    var response = false;
    try {
        response = data.reportInfo.creditFileInfo[0].score.score_txt === '9003';
    } catch (e) {
        response = null;
    }
    return response;
}

function compileUIProfile(data){
    return data.subscription.status;
}

function checkFeatures(params) {
    debug('verify.js: checkFeatures()', params);
    var deferred = q.defer();
    var httpSettings;
    common.tokenService.getMemberToken(params).then(
        function(token) {
            debug('verify.js: checkFeatures() got token', params);
            async.parallel([
                function(callback) {
                    httpSettings = {
                        path: '/api/fulfillment/subscription',
                        host: common.config.getDomain(params.domain),
                        method: 'GET',
                    };
                    common.httpService.httpCallToken(httpSettings, token).then(function(data) {
                        callback(null, {
                            key: 'subscription',
                            value: data.name
                        });
                    }, function(err) {
                        callback(null, {
                            value: 'subscription',
                            key: null
                        });
                    });
                },
                function(callback) {
                    httpSettings = {
                        path: '/api/reportbenefit/reports/forcereload',
                        host: common.config.getDomain(params.domain),
                        method: 'GET',
                    };
                    common.httpService.httpCallToken(httpSettings, token).then(function(data) {
                        var customerId = 'unknown';
                        if (data && data.reportInfo) {
                            customerId = data.reportInfo.customerId;
                        }
                        callback(null, {
                            key: 'customerId',
                            value: customerId
                        });
                    }, function(err) {
                        callback(null, {
                            value: 'customerId',
                            key: null
                        });
                    });
                },
                function(callback) {
                    httpSettings = {
                        path: '/api/reportbenefit/reports/history/',
                        host: common.config.getDomain(params.domain),
                        method: 'GET',
                    };
                    common.httpService.httpCallToken(httpSettings, token).then(function(data) {
                        callback(null, {
                            key: 'has3B',
                            value: compileReportHistory(data)
                        });
                    }, function(err) {
                        callback(null, {
                            value: 'has3B',
                            key: null
                        });
                    });
                },
                function(callback) {
                    httpSettings = {
                        path: '/api/alerts/summary',
                        host: common.config.getDomain(params.domain),
                        method: 'GET',
                    };
                    common.httpService.httpCallToken(httpSettings, token).then(function(data) {
                        callback(null, {
                            key: 'alerts',
                            value: compileAlertSummary(data)
                        });
                    }, function(err) {
                        callback(null, {
                            key: 'alerts',
                            value: null
                        });
                    });

                },
                function(callback) {
                    httpSettings = {
                        path: '/api/uiprofile',
                        host: common.config.getDomain(params.domain),
                        method: 'GET',
                    };
                    common.httpService.httpCallToken(httpSettings, token).then(function(data) {
                        callback(null, {
                            key: 'active',
                            value: compileUIProfile(data)
                        });
                    }, function(err) {
                        callback(null, {
                            key: 'active',
                            value: null
                        });
                    });

                },
                function(callback) {
                    httpSettings = {
                        path: '/api/reportbenefit/reports/latest/ex',
                        host: common.config.getDomain(params.domain),
                        method: 'GET',
                    };
                    common.httpService.httpCallToken(httpSettings, token).then(function(data) {
                        callback(null, {
                            key: 'unscorable',
                            value: compileReportScore(data)
                        });
                    }, function(err) {
                        callback(null, {
                            key: 'unscorable',
                            value: null
                        });
                    });
                }
            ], function(err, results) {
                var response = {};
                results.forEach(function(val) {
                    if (val.value !== null) {
                        response[val.key] = val.value;
                    }
                });
                deferred.resolve(response);
            });
        },
        function onError(err) {
            debug('verify.js: checkfeatures() token failed', err);
            err = ['/api/oauth/token'];
            deferred.resolve(err);
        });
    return deferred.promise;
}
