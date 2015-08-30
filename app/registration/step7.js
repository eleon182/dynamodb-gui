var debug = require('debug')('main');
var config = require('./config');
var common = require('../common');

module.exports = {
    run: run
};

function run(params) {
    params = params || {};
    var activate = {
        path: '/api/fulfillment/activate',
        method: 'POST',
        host: common.config.getDomain(params.domain),
        headers: {
            'Content-Type': 'application/json',
        },
        body: config.step7(params)
    };

    return common.httpService.httpCallToken(activate, params.token);
}
