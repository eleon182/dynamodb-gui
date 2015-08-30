var debug = require('debug')('main');
var q = require('q');

var common = require('../../common');

var table = 'star-users';
var starCache;

module.exports = {
    getAnswers: getAnswers,
    search: search,
    getRandomUser: getRandomUser,
    scan: scan
};

function getAnswers(ssn) {
    var deferred = q.defer();
    var key = {
        "ssn": {
            "S": ssn
        }
    };
    debug('stardatabase: getuser() input', key);
    common.db.getItem(key, table).then(
        function(data) {
            debug('stardatabase:getuser() output', data.Item);
            try {
                data.oowAnswers = JSON.parse(data.oowAnswers);
                debug('stardatabase: getuser() output ', data);
                deferred.resolve(data);
            } catch (e) {
                deferred.reject(e);
            }
        },
        function(err) {
            debug('stardatabase: getuser() output err', err);
            deferred.reject(err);
        });
    return deferred.promise;
}

function scan() {
    var deferred = q.defer();
    if (starCache) {
        deferred.resolve(starCache);
    } else {
        common.db.scan(table).then(
            function(data) {
                starCache = data;
                deferred.resolve(data);
            },
            function(err) {
                deferred.reject(err);
            });
    }
    return deferred.promise;
}

function search(name) {
    var response = [];
    var tmp;
    var deferred = q.defer();
    scan().then(function(starData) {
        starData.forEach(function(val) {
            tmp = val.firstName + ' ' + val.lastName;

            if (tmp.toString().toLowerCase().indexOf(name.toLowerCase()) >= 0 ||
                val.ssn.indexOf(name.toLowerCase()) >= 0) {
                response.push(val);
            }
        });
        debug('stardatabase: findusers()');
        deferred.resolve(response);
    }, function(err) {
        deferred.reject(err);
    });
    return deferred.promise;
}

function getRandomUser() {
    var deferred = q.defer();
    common.db.scan(table).then(function(star) {
        var randomUser = Math.floor(Math.random() * (star.length - 1));
        deferred.resolve(star[randomUser]);
    }, function(err) {
        deferred.reject(err);
    });
    return deferred.promise;
}
