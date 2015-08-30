// 3rd party libraries
var q = require('q');
var uuid = require('node-uuid');
var lo = require('lodash');
var async = require('async');
var debug = require('debug')('main');

// private libraries
var db = require('./data/tokendb');

module.exports = purgeTokens;

function purgeTokens() {
    // 1 day
    var deferred = q.defer();
    var today, date;
    var threshold = 86400000;
    var deleteQueue = [];
    db.scan().then(function(val) {
        val.forEach(function(inner) {
            today = new Date().getTime();
            date = new Date(inner.updateDate).getTime();
            if (today - date > threshold) {
                deleteQueue.push(inner);
            }
        });
        debug('Starting purge: ', deleteQueue.length);
        async.eachSeries(deleteQueue, function(key, callback) {
                db.deleteItem(key).then(function(v) {
                    debug('Purged: ', key.username);
                    callback();
                }, function(err) {
                    callback();
                });
            },
            function() {
                deferred.resolve('Purged: ' + deleteQueue.length);
            }
        );
    }, function(err) {
        deferred.reject('Scan failed');
    });
    return deferred.promise;
}
