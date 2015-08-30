var debug = require('debug')('main');

var offerId = '2c92a0f9483d92170148429b642b324f';

var basic = {
    registrationToken: {
        'client_id': 'experian',
        'scope': 'member',
        'grant_type': 'client_credentials'
    },
    service: {
        'host': 'develop.projectcorvette.us',
        'basicAuthorization': 'Basic MTIzNDU2OmFiY2RlZg==',
    }
};

var memberToken = {
    'client_id': 'experian',
    'scope': 'member',
    'password': 'password',
    'grant_type': 'password',
};

function getRandomDomain(){
    var rand = Math.random()*4;
    var pick = 'dev';
    if(rand > 3) {
        pick = 'qa';
    }
    else if(rand > 2) {
        pick = 'stg';
    }
    else if(rand > 1) {
        pick = 'int';
    }
    return getDomain(pick);
}

function getDomain(domain) {
    var e = {
        integration: 'integration.projectcorvette.us',
        develop: 'develop.projectcorvette.us',
        prod: 'slingshot.experian-direct.com',
        qa: 'qa.projectcorvette.us',
        stg: 'stage.experiancs.com',
        beta: 'beta.projectcorvette.us'
    };

    var response;
    if (domain === 'int') {
        response = e.integration;
    } else if (domain === 'stg') {
        response = e.stg;
    } else if (domain === 'qa') {
        response = e.qa;
    } else if (domain === 'beta') {
        response = e.beta;
    } else {
        response = e.develop;
    }
    return response;
}

module.exports = {
    offerId: offerId,
    getDomain: getDomain,
    getRandomDomain: getRandomDomain,
    basic: basic,
    memberToken: memberToken
};
