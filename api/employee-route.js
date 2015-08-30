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

module.exports = router;
