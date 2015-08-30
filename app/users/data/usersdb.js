// 3rd party libraries
var q = require('q');
var debug = require('debug')('main');

// private libraries
var common = require('../../common');

var table = 'corvette-users';

module.exports = {
    putItem: putItem,
    scan: scan,
    getRandomUser: getRandomUser,
    deleteItem: deleteItem,
    addNotes: addNotes,
    updateStatus: updateStatus,
};

function getRandomUser() {
    var deferred = q.defer();
    scan().then(
        function(data) {
            var rand = Math.floor(Math.random() * (data.length - 1));
            if (data[rand]) {
                deferred.resolve(data[rand]);
            } else {
                deferred.reject(err);
            }
        }, function(err) {
            deferred.reject(err);
        });
    return deferred.promise;
}

function deleteItem(username, env) {
    var key = {
        username: {
            'S': username
        },
        env: {
            'S': env
        },
    };

    return common.db.deleteItem(key, table);
}

function updateStatus(params) {
    var key = {
        username: {
            'S': params.username
        },
        env: {
            'S': params.env
        },
    };
    var expression = "set userStatus = :val1, updateDate = :val2";
    var values = {
        ':val1': {
            'S': params.message
        },
        ':val2': {
            'S': new Date().toString()
        },
    };
    if (params.has3B !== undefined) {
        expression += ', has3B = :val3';
        values[':val3'] = {
            'BOOL': params.has3B
        };
    }
    if (params.unscorable !== undefined) {
        expression += ', unscorable= :val4';
        values[':val4'] = {
            'BOOL': params.unscorable
        };
    }
    if (params.alerts !== undefined) {
        expression += ', alerts = :val5';
        values[':val5'] = {
            'BOOL': params.alerts
        };
    }
    if (params.subscription !== undefined) {
        expression += ', subscription = :val6';
        values[':val6'] = {
            'S': params.subscription
        };
    }
    if (params.customerId!== undefined) {
        expression += ', customerId = :val7';
        values[':val7'] = {
            'S': params.customerId
        };
    }
    if (params.active!== undefined) {
        expression += ', active = :val8';
        values[':val8'] = {
            'S': params.active
        };
    }
    return common.db.updateItem(key, expression, values, params.table);
}

function addNotes(data) {
    debug('userdatabase: addNotes');
    var deferred = q.defer();
    var key = {
        username: {
            'S': data.username
        },
        env: {
            'S': data.env
        },
    };
    var expression = "set notes= :val1";
    var values = {
        ':val1': {
            'S': data.notes
        }
    };

    return common.db.updateItem(key, expression, values, table);
}

function scan() {
    return common.db.scan(table);
}

function putItem(data) {
    debug('create: ' + JSON.stringify(data));
    var item = {
        username: {
            'S': data.username
        },
        env: {
            'S': data.env
        },
        userStatus: {
            'S': 'unknown'
        },
        notes: {
            'S': ' '
        },
        type: {
            'S': 'unknown'
        },
        createDate: {
            'S': new Date().toString()
        },
        updateDate: {
            'S': new Date().toString()
        }
    };
    return common.db.putItem(item, table);
}
