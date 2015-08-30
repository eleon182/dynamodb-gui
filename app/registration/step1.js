var debug = require('debug')('main');

var config = require('./config');
var common = require('../common');

module.exports = {
    run: run
};

function run(params) {
    debug('Entered op1.js');
    params = params || {};

    var httpSettings = {
        path: '/api/profile/customer',
        //path: '/api/account/customerprofile',
        host: common.config.getDomain(params.domain),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: config.step1(params)
    };
    debug('op1.js setup httpsettings');
    return common.httpService.httpCallToken(httpSettings, params.token);
}
