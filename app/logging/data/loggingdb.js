// 3rd party libraries
var q = require('q');
var lo = require('lodash');
var debug = require('debug')('main');

// private libraries
var common = require('../../common');

// constants
var table = 'corvette-logging';

module.exports = {
    scan: scan,
    putItem: putItem,
    query: query
};

function scan() {
    return common.db.scan(table);
}

function putItem(data) {
    debug('create: ' + JSON.stringify(data));
    var item = {
        env: {
            'S': data.env
        },
        status: {
            'S': data.status.toString()
        },
        date: {
            'S': new Date().toString()
        }
    };
    return common.db.putItem(item, table);
}

function query(key) {
    return common.db.query(key, table);
}
