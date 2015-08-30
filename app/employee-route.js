var express = require('express');
var debug = require('debug')('main');
var router = express.Router();

var employee = require('./employee');
var slack = require('./slackApi');

router.post('/completeresetpassword', function(req, res, next) {
    req.body.newPassword = 'password';
    employee.utility.getUser(req.body.username).then(function(data) {
            if (data.customerId === req.body.token) {
                employee.utility.updatePassword(req.body).then(function() {
                        res.end();
                    },
                    function(err) {
                        res.status(404).json({
                            code: 'invalidUsername',
                            description: 'Username not found'
                        });
                    });
            } else {
                res.status(404).json({
                    code: 'invalidToken',
                    description: 'Invalid Token'
                });
            }
        },
        function(err) {
            res.status(404).json({
                code: 'invalidUsername',
                description: 'Username not found'
            });

        });
});

router.post('/resetpassword', function(req, res, next) {
    employee.utility.getUser(req.body.username).then(function(data) {
            var params = {
                text: 'https://dwol8oja4xhjs.cloudfront.net/#/completeResetPassword?token=' + data.customerId + '&username=' + req.body.username,
                channel: '@' + req.body.username,
                username: 'UI Tools'
            };
            slack.sendMessage(params).then(function(data) {
                if (data.ok) {
                    res.end();
                } else {
                    res.status(401).json({
                        code: 'invalidSlackUsername',
                        description: 'Username not found'
                    });
                }
            });
        },
        function(err) {
            res.status(401).json({
                code: 'invalidSlackUsername',
                description: 'Username not found'
            });
        });
});

router.post('/activate', function(req, res, next) {
    employee.activate(req.body).then(function() {
        res.end();
    }, function(err) {
        res.status(401).json(err);
    });
});

router.post('/create', function(req, res, next) {
    debug('logging-route: get');
    employee.registration(req.body).then(function(data) {
        var params = {
            text: 'https://dwol8oja4xhjs.cloudfront.net/#/completeRegistration?token=' + data + '&username=' + req.body.username,
            channel: '@' + req.body.username,
            username: 'UI Tools'
        };
        slack.sendMessage(params).then(
            function(data) {
                debug('employee: registration create slacking', data.ok);
                if (data.ok) {
                    slack.sendMessage({
                        text: 'User registered successfully: ' + req.body.username,
                        channel: '@eleon182',
                        username: 'UI Tools'
                    });
                    res.end();
                } else {
                    debug('employee: registration create slacking error', data);
                    // employee.utility.deleteUser(req.body.username);
                    slack.sendMessage({
                        text: 'User attempted to login with bad username: ' + req.body.username,
                        channel: '@eleon182',
                        username: 'UI Tools'
                    });
                    res.status(401).json({
                        code: 'invalidSlackUsername',
                        description: 'Invalid slack username'
                    });
                }
            },
            function(err) {
                res.status(500).json({
                    code: 'slackError',
                    description: 'Slack error'
                });
            });
    }, function(err) {
        debug('employee: create() error', err);
        slack.sendMessage({
            text: err.description + ': ' + req.body.username,
            channel: '@eleon182',
            username: 'UI Tools'
        });
        res.status(404).json(err);
    });
});

module.exports = router;
