var debug = require('debug')('main');
var config = require('./config');
var common = require('../common');

function run(params) {
    params = params || {};

    var idverifyPOST = {
        path: '/api/idverify',
        method: 'POST',
        host: common.config.getDomain(params.domain),
        headers: {
            'Content-Type': 'application/json',
        },
        body: config.step5(params)

    };
    //idverifyPOST.body = JSON.stringify(compileAnswers(params));
    return common.httpService.httpCallToken(idverifyPOST, params.token);
}

function compileAnswers(data) {
    if(!data.answers){
        return;
    }
    debug('step5', data);
    var response = {
        answer1: data.answers[1],
        answer2: data.answers[2],
        answer3: data.answers[3],
        answer4: data.answers[4],
        questionSetId: data.questionSetId
    };
    return response;
}

module.exports = {
    run: run
};

