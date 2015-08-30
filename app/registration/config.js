var debug = require('debug')('main');

var common = require('../common');

module.exports = {
    step1: step1,
    step2: step2,
    step3: step3,
    step5: step5,
    step6: step6,
    step7: step7,
};

function step1(params) {

    return {
        customer: {
            email: 'amark@exp.com',
            currentAddress: {
                city: 'los angeles',
                state: 'CA',
                street: '1504 pendolino lane',
                zip: '90047',
                line2: '',
            },
            name: {
                first: params.firstName,
                last: params.lastName,
                middle: '',
                suffix: null,
                title: null
            }
        },
        offerId: params.offerId
    };
}

function step2(params) {
    debug('config step2', params);
    return {
        offerId: params.offerId
    };
}

function step3(params) {
    return {
        creditCard: {
            cardNumber: '5105105105105100',
            cvv: '123',
            expMonth: '1',
            expYear: '2019'
        },
        customer: {
            confirmPassword: 'password',
            dob: '1982-02-20',
            password: 'password',
            ssn: params.ssn,
            userName: params.username
        },
        offerId: params.offerId
    };
}

function step5(params) {
    if (!params.answers) {
        return;
    }
    return {
        answer1: params.answers[1],
        answer2: params.answers[2],
        answer3: params.answers[3],
        answer4: params.answers[4],
        questionSetId: params.questionSetId
    };

}

function step6(params) {
    return {
        customer: {
            confirmPin: '1234',
            pin: '1234',
            phone: {
                area: '123',
                city: '123',
                ext: null,
                number: '1234',
                type: null
            },
            securityQuestions: {
                answer: 'steve',
                id: '1',
                question: null
            },
        },
        offerId: params.offerId
    };
}

function step7(params) {
    return {
        subscriptionId: params.id
    };
}

var config = {};


config.account = {
    customerprofilePost: {
        customer: {
            email: 'amark@exp.com',
            currentAddress: {
                city: 'los angeles',
                state: 'CA',
                street: '1504 pendolino lane',
                zip: '90047',
                line2: '',
            },
            name: {
                first: 'esteban',
                last: 'leon',
                middle: '',
                suffix: null,
                title: null
            }
        },
        offerId: common.config.offerId
    },
    customerprofilePatch: {
        customer: {
            confirmPin: '1234',
            pin: '1234',
            phone: {
                area: '123',
                city: '123',
                ext: null,
                number: '1234',
                type: null
            },
            securityQuestions: {
                answer: 'steve',
                id: '1',
                question: null
            },
        },
        offerId: common.config.offerId
    }
};

config.registration = {
    customerWithCard: {
        creditCard: {
            cardNumber: '5105105105105100',
            cvv: '123',
            expMonth: '1',
            expYear: '2019'
        },
        customer: {
            confirmPassword: 'password',
            dob: '1982-02-20',
            password: 'password',
            ssn: '666',
        },
        offerId: common.config.offerId
    },
    op4: {
        customer: {
            confirmPin: '1234',
            pin: '1234',
            phone: {
                area: '123',
                city: '123',
                ext: null,
                number: '1234',
                type: null
            },
            securityQuestions: {
                answer: 'steve',
                id: '1',
                question: null
            },
        },
        offerId: common.config.offerId
    }
};

config.fulfillment = {
    subscription: {
        offerId: common.config.offerId
    }
};

config.idverify = {
    answers: {
        answer1: '5',
        answer2: '5',
        answer3: '5',
        answer4: '5',
        answer5: '5',
    },
    answerList: []
};

