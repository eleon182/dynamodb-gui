var express = require('express');
var chalk = require('chalk');
var serviceHealth = require('./serviceHealth');
var debug = require('debug')('main');

var router = express.Router();

setInterval(function(val) {
    serviceHealth.process.checkService();
}, 15000);
setInterval(function(val) {
    serviceHealth.db.purgeOldData();
}, 10800000);
serviceHealth.db.purgeOldData();

router.get('/checkservice', function(req, res, next) {
    debug('servicehealth-route: checkService');
    serviceHealth.process.checkService().then(
        function(data) {
            res.json(data);
        },
        function(err) {
            res.status(404).json(err);
        }
    );
});

router.get('/purge', function(req, res, next) {
    debug('servicehealth-route: purge');
    serviceHealth.db.purgeOldData().then(function(val) {
        res.send(val);
    }, function(err) {
        res.send(err);
    });
});

router.get('/', function(req, res, next) {
    debug('servicehealth-route: scan');
    serviceHealth.db.scan().then(function(data) {
        res.json(data);
    }, function(err) {
        res.status(404).json(err);
    });
});

module.exports = router;
