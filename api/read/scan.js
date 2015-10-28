var common  = require('../common');
var json = require('../json');
var q = require('q');

module.exports = scan;

function scan(params){
    var deferred = q.defer();
    var cache = json.get(params.table);
    if(!cache || params.refresh){
        common.db.scan(params.table).then(function(data){
            json.save(params.table, data, function(){});
            deferred.resolve(data);
        },
        function(err){
            deferred.reject(err);
        });
    }
    else {
        deferred.resolve(cache);
    }
    return deferred.promise;
}
