var serviceList = [
    '/api/reportbenefit/reports/forcereload',
    '/api/fulfillment/subscription',
    '/api/uiprofile',
    '/api/alerts/summary',
    '/api/reportbenefit/scores/latestreport/EX',
    '/api/reportbenefit/reports/history',
    //'/api/login/securityQuestions',
    '/api/offers/customer',
];

module.exports = {
    serviceList: serviceList,
    getRandomService: getRandomService
};

function getRandomService(){
    var rand = Math.floor(Math.random()*(serviceList.length-1));
    return serviceList[rand];
}
