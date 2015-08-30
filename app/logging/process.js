// 3rd party libraries
var q = require('q');
var lo = require('lodash');
var debug = require('debug')('main');

// private
var db = require('./data/loggingdb');
var compiler = require('./data/loggingdb');
var users = require('../users');

module.exports = {
    check: check
};

function check() {
    //jshint ignore: start
    var deferred = q.defer();
    users.updates.getServerHealth().then(function(stat) {
        var random, params;
        for (var key in stat) {
            params = {
                env: {
                    ComparisonOperator: 'EQ',
                    AttributeValueList: [{
                        S: key
                    }]
                }
            };
            db.query(params).then(function(val) {
                if (val.length === 0) {
                    deferred.reject('No records found');
                } else {
                    val.sort(function(a, b) {
                        return new Date(a.date) - new Date(b.date);
                    });

                    if (val[val.length - 1].status !== stat[val[0].env].ratio.toString() || (new Date(val[val.length - 1].date).getDate() !== new Date().getDate())) {
                        debug('loggingdatabase: process() creating', val[val.length - 1], stat[val[0].env].ratio);
                        db.putItem({
                            env: val[0].env,
                            status: stat[val[0].env].ratio,
                        });
                        deferred.resolve('Updated ' + val[0].env + ' ' + val[0].ratio);
                    } else {
                        debug('loggingdatabase: process() no update required');
                        deferred.resolve('No update required');
                    }
                }
            });
        }
    });
    return deferred.promise;
    //jshint ignore: end
}
