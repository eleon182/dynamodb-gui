// 3rd party libraries
var debug = require('debug')('main');

module.exports = {
    step1: require('./step1').run,
    step2: require('./step2').run,
    step3: require('./step3').run,
    step4: require('./step4').run,
    step5: require('./step5').run,
    step6: require('./step6').run,
    step7: require('./step7').run,
    step8: require('./step8').run,
    token: require('../common').tokenService.getBasicToken
};

function createUser(params) {
    var deferred = q.defer();
    var userToken;
    debug('funnel.js: createUser()', params);
    console.log(chalk.bgGreen('Creating user: ' + params.username));
    tokenService.getBasicToken(params).then(function(token) {
        params.token = token;
        async.series([

            function(callback) {
                op1.run(params, callback);
            },
            function(callback) {
                op2.run(params, callback);
            },
            function(callback) {
                op3.run(params, callback);
            }
        ], function(err, data) {
            debug('done create user');
            if (err) {
                deferred.reject(data);
            } else {
                debug('done create user no error');
                data.push({
                    token: params.token
                });
                debug('done create user no error resolve');
                deferred.resolve(data);
            }
        });
    }, function onError(err) {
        deferred.reject(err);
    });

    return deferred.promise;
}

function submitAnswers(params) {
    var deferred = q.defer();
    async.series([

        function(callback) {
            op3answers.run(params, callback);
        },
        function(callback) {
            op4.run(params, callback);
        },
        function(callback) {
            dashboard.run(params, callback);
        },
    ], function(err, data) {
        if (err) {
            deferred.reject(data);
        } else {
            deferred.resolve(data);
        }
    });
    return deferred.promise;
}
