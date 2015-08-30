var debug = require('debug')('main');
var config = require('./config');
var common = require('../common');

module.exports = {
    run: run
};

function run(params) {
    params = params || {};
    var customerprofile = {
        path: '/api/registration/op4',
        method: 'POST',
        host: common.config.getDomain(params.domain),
        headers: {
            'Content-Type': 'application/json',
        },
        body: config.step6(params)
    };

    return common.httpService.httpCallToken(customerprofile, params.token);

}
