var db = require('../common/db-config');
var debug = require('debug')('main');
var star = require('./star-users.json');
var q = require('q');
var async = require('async');
var chalk = require('chalk');

var table = 'star-users';

module.exports = {
    create: create,
    read: read,
};

function read() {
    var deferred = q.defer();
    var params = {
        TableName: table
    };
    db.scan(params, function(err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data.Items);
        }
    });
    return deferred.promise;
}

function create(data) {
    debug('inside create', data);

    var deferred = q.defer();
    var item = {
        ssn: {
            'S': data.ssn
        },
        firstName: {
            'S': data.firstName
        },
        lastName: {
            'S': data.lastName
        },
        oowAnswers: {
            'S': data.oowAnswers
        }
    };
    db.putItem({
        TableName: table,
        Item: item
    }, function(err, data) {
        if (err) {
            debug('error');
            deferred.reject(err);
        } else {
            debug('success');
            deferred.resolve(data);
        }

    });
    return deferred.promise;
}

var count = 0;

function insert(oow, callback) {
    debug('inside insert');
    var user = oow.splice(0, 3);
    var entry = {
        ssn: user[0],
        firstName: user[1],
        lastName: user[2],
        oowAnswers: JSON.stringify(oow)
    };

    create(entry).then(function(val) {
        debug('success create');
        console.log(chalk.bgGreen('Inserted: ' + user[1] + ' ' + user[2] + ' ' + count));
        count++;
        callback();
    }, function(err) {
        console.log(chalk.bgRed('Error: ' + user[1] + ' ' + user[2] + ' ' + count));
        callback();
    });
}
debug('before async');
async.eachSeries(star, insert, function(err) {
    // if any of the file processing produced an error, err would equal that error
    if (err) {
        // One of the iterations produced an error.
        // All processing will now stop.
        console.log('A file failed to process');
    } else {
        console.log('All files have been processed successfully');
    }
});
