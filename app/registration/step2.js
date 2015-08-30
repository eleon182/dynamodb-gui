var debug = require('debug')('main');
var config = require('./config');
var common = require('../common');

module.exports = {
    run: run
};

function run(params) {
    params = params || {};
    var httpSettings = {
        path: '/api/fulfillment/subscription',
        host: common.config.getDomain(params.domain),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: config.step2(params)
    };
    return common.httpService.httpCallToken(httpSettings, params.token);
}
