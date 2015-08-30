// 3rd party libraries
var q = require('q');
var async = require('async');
var lo = require('lodash');
var debug = require('debug')('main');

// private libraries
var member = require('./member');

var slack = require('../slackApi');
var data = require('./data');
var compiler = require('./helpers/compileData');

var table = 'corvette-users';
var serverStatus;

module.exports = {
    all: all,
    random: random,
    single: single,
    getServerHealth: getServerHealth
};

function all() {
    console.log('Performing database update');
    var deferred = q.defer();
    var count = 0;
    data.usersdb.scan().then(function(val) {
        deferred.resolve('Launching Database Update: ' + val.length + ' Records');
        async.eachSeries(val, function(inner, callback) {
            single(inner.username, inner.env).then(function(data) {
                debug('Update Completed: ' + count + ' / ' + (val.length - 1));
                count++;
                callback();
            }, function(err) {
                callback();
            });
        }, function(err) {
            console.log('Database Update completed');
        });
    }, function(err) {
        deferred.reject(err);
    });
    return deferred.promise;
}

function getLatest(users) {
    var latest = users.sort(function(a, b) {
        return new Date(a.updateDate) - new Date(b.updateDate);
    });
    return latest[0];
}

function random() {
    debug('userdatabase: updateRandom()');
    var deferred = q.defer();
    data.usersdb.scan().then(
        function(val) {
            var latest = getLatest(val);
            console.log('Updating: ' + latest.username + ' ' + latest.env);
            single(latest.username, latest.env).then(function(data) {
                console.log('Update completed');
                reportFindings();
                deferred.resolve(data);
            });
        },
        function(err) {
            deferred.reject(err);
        });
    return deferred.promise;
}

function single(username, env) {
    debug('userdatabae: updatesingle()', username, env);
    var deferred = q.defer();
    if (username && env) {
        var params = {
            username: username,
            domain: env
        };
        member.verify.account(params).then(
            function() {
                member.features.checkFeatures(params).then(function(features) {
                        features.username = username;
                        features.env = env;
                        features.table = table;
                        features.message = 'OK';

                        data.usersdb.updateStatus(features);
                        deferred.resolve(username + ' ' + env + ' OK');
                    },
                    function(err) {
                        deferred.resolve();
                    });
            },
            function onError(err) {
                var message = buildErrorString(err);
                var response = {
                    username: username,
                    env: env,
                    table: table,
                    message: message
                };
                if (message) {
                    data.usersdb.updateStatus(response);
                }
                deferred.resolve(message);
            });
    } else {
        deferred.resolve();
    }
    return deferred.promise;
}

function buildErrorString(str) {
    var response = '';
    if (lo.isArray(str)) {
        str.forEach(function(val) {
            response += val + ' ';
        });
    }
    else {
        response = false;
    }
    response = response.trim();
    return response;
}

function getServerHealth() {
    var deferred = q.defer();
    data.usersdb.scan().then(function(val) {
        val.sort(function(a, b) {
            return new Date(b.updateDate) - new Date(a.updateDate);
        });
        var response = [];
        //1 hour
        var threshold = 10800000;
        var today = new Date().getTime();
        val.forEach(function(innerVal) {
            if ((today - new Date(innerVal.updateDate).getTime()) < threshold) {
                response.push(innerVal);
            }
        });
        deferred.resolve(compiler.serverHealth(response));
    }, function(err) {
        deferred.reject(err);
    });
    return deferred.promise;
}

function reportFindings() {
    getServerHealth().then(function(stat) {
        var change = false;
        if (!serverStatus) {
            serverStatus = stat;
        }
        for (var key in stat) {
            if ((Math.abs(stat[key].ratio - serverStatus[key].ratio) > 30) &&
                (stat[key].ratio === 0 || stat[key].ratio === 100 ||
                    serverStatus[key].ratio === 0 || serverStatus[key].ratio === 100)) {
                change = true;
                serverStatus = stat;
            }
        }
        debug('USERDATBASE calcs', stat, change);
        if (change) {
            slack.sendMessage({
                text: buildMessage(stat),
                // channel: '@eleon182',
            });
        }
    });
}

function buildMessage(stat) {
    var message = '\n          SERVICE STATUS REPORT\n     ==============================';
    message += '\nDevelop status: ' + buildRatingMessage(stat.dev.ratio);
    if (Object.keys(stat.dev.apiList).length > 0) {
        message += buildApiListMessage(stat.dev);
    }
    message += '\n\nQA status: ' + buildRatingMessage(stat.qa.ratio);
    if (Object.keys(stat.qa.apiList).length > 0) {
        message += buildApiListMessage(stat.qa);
    }
    message += '\n\nIntegration status: ' + buildRatingMessage(stat.int.ratio);
    if (Object.keys(stat.int.apiList).length > 0) {
        message += buildApiListMessage(stat.int);
    }
    message += '\n\nStage status: ' + buildRatingMessage(stat.stg.ratio);
    if (Object.keys(stat.stg.apiList).length > 0) {
        message += buildApiListMessage(stat.stg);
    }
    message += '\n\nhttps://tinydancers.projectcorvette.us/#?next=serviceHealth';

    return message;
}

function buildRatingMessage(ratio) {
    var response = 'PERFECT';
    if (ratio === 0) {
        response = 'DOWN';
    } else if (ratio < 99) {
        response = 'OK';
    }
    return response;
}

function buildApiListMessage(data) {
    var response = '';
    for (var key in data.apiList) {
        response += '\n  ' + key + ': ' + (data.total - data.apiList[key]) + '/' + data.total + ' ' + Math.floor(100 * (data.total - data.apiList[key]) / data.total) + '%';
    }
    return response;
}
