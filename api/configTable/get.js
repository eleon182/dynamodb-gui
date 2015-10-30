var config = require('./tableList');
var common = require('../common');
var async = require('async');
module.exports = get;

function get(mainCallback){
    async.parallel([
        function(callback){
            scan(config.dev, callback);
        },
        function(callback){
            scan(config.qa, callback);
        },
        function(callback){
            scan(config.int, callback);
        },
    ],
    function(err,results){
        if(err){
            return mainCallback(err, results);
        }
        else {
            var response = {
                dev: compileData(results[0]),
                qa: compileData(results[1]),
                int: compileData(results[2])
            };
            mainCallback(null, response);
        }
    });
}
function compileData(data){
    var response = [];
    data.forEach(function(val){
        if(val.version === '0.9' && val.config){
            var tables = JSON.parse(val.config);
            if(tables && tables.dynamo_tables){
                response.push({
                    service: val.service,
                    data: extractTables(tables.dynamo_tables)
                });
            }
        }
    });
    return response;
}

function extractTables(tables){
    var response = [];
    tables.forEach(function(val){
        val.physicalid.forEach(function(inner){
            response.push(inner);
        });
    });
    return response;
}

function scan(table, callback){
    common.db.scan(table).then(function(data){
        callback(null, data);
    },
    function(err){
        callback(err, null);
    });
}
