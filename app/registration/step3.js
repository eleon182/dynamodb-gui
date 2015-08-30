var debug = require('debug')('xmain');
var config = require('./config');
var common = require('../common');

module.exports = {
    run: run
};

function run(params) {
    params = params || {};

    debug('Entered op3.js');
    var registration = {
        path: '/api/registration/customerWithCard',
        method: 'POST',
        host: common.config.getDomain(params.domain),
        headers: {
            'Content-Type': 'application/json',
        },
        body: config.step3(params)
    };
    //debug('op3.js setup httpsettings', params);
    //config.registration.customerWithCard.customer.userName = params.username;
    //config.registration.customerWithCard.customer.ssn = params.ssn;
    //debug('op3.js setup httpsettings', config.registration.customerWithCard);
    //registration.body = config.registration.customerWithCard;

    debug('op3.js calling http');
    return common.httpService.httpCallToken(registration, params.token);
}
