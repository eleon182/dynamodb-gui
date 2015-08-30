var express = require('express');
var debug = require('debug')('main');
var router = express.Router();

var slack = require('./slackApi');

router.post('/create', function(req, res, next) {
    if (!req.body.message) {
        res.end();
    } else {
        slack.sendMessage({
            text: 'Suggestion from: ' + req.body.employeeUsername + '\n' + req.body.message,
            channel: '@eleon182',
            username: 'UI Tools'
        });
        res.end();
    }
});

module.exports = router;
