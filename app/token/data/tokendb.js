// 3rd party libraries
var q = require('q');
var debug = require('debug')('main');
var uuid = require('node-uuid');

// private libraries
var common = require('../../common');

var table = 'corvette-token';

module.exports = {
    putItem: putItem,
    scan: scan,
    deleteItem: deleteItem,
    getItem: getItem,
};

function getItem(token) {
    var deferred = q.defer();
    var key = {
        "token": {
            "S": token
        }
    };
    return common.db.getItem(key, table);
}

function deleteItem(params) {
    var key = {
        token: {
            'S': params.token
        },
    };

    return common.db.deleteItem(key, table);
}

function scan() {
    return common.db.scan(table);
}

function putItem(data) {
    var deferred = q.defer();
    debug('create: ' + JSON.stringify(data));
    var token =  uuid.v1();
    var item = {
        username: {
            'S': data.username
        },
        token: {
            'S': token
        },
        createDate: {
            'S': new Date().toISOString()
        },
        updateDate: {
            'S': new Date().toISOString()
        }
    };
    common.db.putItem(item, table).then(function(val){
        deferred.resolve({token:token});
    },
    function(err){
        deferred.reject(err);
    });
    return deferred.promise;
}
