var AWS = require('aws-sdk');
var debug = require('debug')('main');
var lo = require('lodash');
var q = require('q');
AWS.config.update({
    region: 'us-west-2',
    // profile: 'steve'
});

var dataHelper = require('./helpers/dataHelper');

var db = new AWS.DynamoDB();

module.exports = {
    scan: scan,
    getItem: getItem,
    putItem: putItem,
    deleteItem: deleteItem,
    query: query,
    updateItem: updateItem,
    listTables: listTables
};

function listTables(params){
    var deferred = q.defer();

    db.listTables(params, function(err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }
    });
    return deferred.promise;
}
function updateItem(key, expression, values, table) {
    var deferred = q.defer();
    var params = {
        TableName: table,
        Key: key,
        UpdateExpression: expression,
        ExpressionAttributeValues: values
    };

    db.updateItem(params, function(err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }
    });
    return deferred.promise;
}

function query(key, table) {
    var deferred = q.defer();
    var params = {
        TableName: table,
        KeyConditions: key
            //KeyConditions: {
            //env: {
            //ComparisonOperator: 'EQ',
            //AttributeValueList: [{
            //S: env
            //}]
            //}
            //}
    };
    db.query(params, function(err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            dataHelper.removeKey(data.Items);
            deferred.resolve(data.Items);
        }
    });
    return deferred.promise;
}

function deleteItem(key, table) {
    var deferred = q.defer();
    var params = {
        TableName: table,
        Key: key
    };

    db.deleteItem(params, function(err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }
    });
    return deferred.promise;
}

function getItem(key, table) {
    var deferred = q.defer();

    var params = {
        TableName: table,
        Key: key
    };

    db.getItem(params, function(err, data) {
        debug('dynamodb: getitem()', err, data);
        if (err || lo.isEmpty(data)) {
            deferred.reject(err);
        } else {
            try {
                dataHelper.removeKey(data.Item);
                deferred.resolve(data.Item);
            } catch (e) {
                deferred.reject(e);
            }
        }
    });
    return deferred.promise;
}

function scan(table) {
    var deferred = q.defer();
    var params = {
        TableName: table
    };
    db.scan(params, function(err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            dataHelper.removeKey(data.Items);
            deferred.resolve(data.Items);
        }
    });
    return deferred.promise;
}

function putItem(item, table) {
    var deferred = q.defer();

    db.putItem({
        TableName: table,
        Item: item
    }, function(err, data) {
        debug('putitem: ', err, table, item);
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }

    });
    return deferred.promise;
}
