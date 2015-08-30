// 3rd party libraries
var q = require('q');
var uuid = require('node-uuid');
var lo = require('lodash');
var async = require('async');
var debug = require('debug')('main');

// private libraries
var common = require('../../common');

// constants
var table = 'corvette-service-health';

module.exports = {
    scan: scan,
    putItem: putItem,
    purgeOldData: purgeOldData
};

function scan() {
    return common.db.scan(table);
}

function putItem(data) {
    debug('create: ' + JSON.stringify(data));
    var item = {
        entryId: {
            'S': uuid.v1()
        },
        service: {
            'S': data.service
        },
        username: {
            'S': data.username
        },
        domain: {
            'S': data.domain
        },
        status: {
            'S': data.status
        },
        date: {
            'S': new Date().toString()
        }
    };
    return common.db.putItem(item, table);
}

function purgeOldData() {
    // 3 days
    var deferred = q.defer();
    var threshold = 700;
    var today, date;
    var deleteQueue = [];
    scan().then(function(val) {
        if (val.length > threshold) {
            val.sort(function(a, b) {
                return new Date(a.date) - new Date(b.date);
            })
            val = val.slice(0, val.length - threshold);

            val.forEach(function(inner) {
                deleteQueue.push({
                    entryId: {
                        'S': inner.entryId
                    },
                });
            });
            deferred.resolve('Purging: ' + deleteQueue.length);
            debug('Purged: ', deleteQueue.length);
            async.eachSeries(deleteQueue, function(key, callback) {
                common.db.deleteItem(key, table).then(function(v) {
                    debug('Purged: ', key);
                    callback();
                }, function(err) {
                    callback();
                });
            });
        }
    }, function(err) {
        deferred.reject('Scan failed');
    });
    return deferred.promise;
}
