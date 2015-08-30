// 3rd party dependencies
var querystring = require('querystring');
var http = require('https');
var q = require('q');
var debug = require('debug')('main');
var chalk = require('chalk');
var lo = require('lodash');

function httpCall(settings, callback) {
    var data = '';
    var deferred = q.defer();
    if(settings.body && lo.isObject(settings.body)){
        settings.body = JSON.stringify(settings.body);
    }
    console.log(chalk.inverse('Calling: ' + settings.host + ' ' + settings.path + ' ' + settings.method + ' '));
    debug('httpService: httpCall()', settings);
    var request = http.request(settings, function(res) {
        var output = 'Route: ' + settings.path + ' ' + settings.method + ' ' + res.statusCode;
        if (res.statusCode == 200) {
            console.log(chalk.bgBlue(output));
        } else {
            console.log(chalk.bgRed(output));
            debug(data);
        }
        res.setEncoding('utf8');
        res.on('end', function(response) {
            res.data = data;
            if (res.statusCode == 200) {
                deferred.resolve(data);
            } else {
                var error = {
                    data: data,
                    code: res.statusCode
                };
                deferred.reject(error);
            }
        });
        res.on('data', function(response) {
            data += response;
            try {
                data = JSON.parse(data.toString());
            } catch (error) {}
        });
        res.on('error', function(err) {
            console.log(chalk.bgRed(err));
            deferred.reject(err);
        });
    });

    request.on('timeout', function(err) {
        console.log(chalk.bgRed(err));
        deferred.reject(err);
    });

    request.on('error', function(err) {
        console.log(chalk.bgRed(err));
        deferred.reject(err);
    });

    if (settings.body) {
        request.write(settings.body);
    }
    request.end();

    return deferred.promise;
}

function httpCallToken(settings, token) {
    if (!settings.headers) {
        settings.headers = {};
    }
    settings.headers.Authorization = 'Bearer ' + token;

    return httpCall(settings);
}

module.exports = {
    httpCall: httpCall,
    httpCallToken: httpCallToken,
};
