var debug = require('debug')('xmain');
var config = require('./config');
var common = require('../common');

module.exports = {
    run: run
};

function run(params) {
    params = params || {};

    debug('Entered op3.js');
    var idverifyGET = {
        path: '/api/idverify',
        host: common.config.getDomain(params.domain),
        method: 'GET',
    };

    return common.httpService.httpCallToken(idverifyGET, params.token);
}
