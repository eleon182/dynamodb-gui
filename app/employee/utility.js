// 3rd party libraries
var q = require('q');
var debug = require('debug')('main');

// private libraries
var db = require('./data/employeedb');

module.exports = {
    updateStatus: updateStatus,
    getUser: getUser,
    deleteUser: deleteUser,
    updatePassword: updatePassword
};

function updateStatus(params) {
    var deferred = q.defer();
    if (!(params.username)) {
        deferred.reject({
            code: 'missingFields',
            description: 'Required fields: username'
        });
    } else {
        db.changeStatus(params).then(function(data) {
            deferred.resolve(data);
        }, function(err) {
            deferred.reject(err);
        });
    }
    return deferred.promise;
}

function updatePassword(params){
    return db.updatePassword(params);
}

function deleteUser(username){
    return db.deleteItem(username);
}

function getUser(username){
    return db.getItem(username);
}
