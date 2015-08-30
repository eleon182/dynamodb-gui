var debug = require('debug')('main');
var config = require('./config');
var common = require('../common');

module.exports = {
    run: run
};

function run(params) {
    debug('dashboard entry');
    params = params || {};
    var forcereload = {
        path: '/api/reportbenefit/reports/forcereload',
        host: common.config.getDomain(params.domain),
        method: 'GET',
    };
    debug('dashboard setup ');
    return common.httpService.httpCallToken(forcereload, params.token);
}
