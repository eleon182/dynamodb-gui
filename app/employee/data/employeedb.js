// 3rd party libraries
var q = require('q');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var debug = require('debug')('main');

// private libraries
var common = require('../../common');

var table = 'corvette-employee';

module.exports = {
    putItem: putItem,
    scan: scan,
    getItem: getItem,
    changeStatus: changeStatus,
    updatePassword: updatePassword,
    deleteItem: deleteItem
};

function deleteItem(username) {
    var key = {
        username: {
            'S': username
        },
    };

    return common.db.deleteItem(key, table);
}

function getItem(username) {
    var deferred = q.defer();
    var key = {
        "username": {
            "S": username
        }
    };
    return common.db.getItem(key, table);
}

function updatePassword(params) {
    var key = {
        username: {
            'S': params.username
        }
    };
    var expression = "set password = :val1";
    var values = {
        ':val1': {
            'S': bcrypt.hashSync(params.newPassword, 8)
        },
    };
    return common.db.updateItem(key, expression, values, table);
}

function changeStatus(params) {
    var key = {
        username: {
            'S': params.username
        }
    };
    var expression = "set active = :val1";
    var values = {
        ':val1': {
            'BOOL': !!params.active
        },
    };
    return common.db.updateItem(key, expression, values, table);
}

function scan() {
    return common.db.scan(table);
}

function putItem(data) {
    debug('create: ' + JSON.stringify(data));
    var deferred = q.defer();
    var customerId =  uuid.v1();
    var item = {
        username: {
            'S': data.username
        },
        password: {
            'S': bcrypt.hashSync(data.password, 8)
        },
        active: {
            'BOOL': false
        },
        firstName: {
            'S': data.firstName
        },
        lastName: {
            'S': data.lastName
        },
        customerId: {
            'S': customerId
        },
        createDate: {
            'S': new Date().toISOString()
        },
        updateDate: {
            'S': new Date().toISOString()
        }
    };
    common.db.putItem(item, table).then(
        function(val){
            deferred.resolve(customerId);
        },
        function(err){
            deferred.reject(err);
        });
    return deferred.promise;
}
