var express = require('express');
var debug = require('debug')('main');
var router = express.Router();

var token = require('./token');
var employee = require('./employee');

setInterval(function() {
    token.purge();
}, 21600000);
token.purge();

router.post('/token', function(req, res, next) {
    debug('logging-route: get');
    employee.validate(req.body).then(function() {
        token.getToken(req.body).then(function(data) {
            res.json(data);
        }, function(err) {
            res.status(404).json(err);
        });
    }, function(err) {
        res.status(404).json(err);
    });
});

module.exports = router;
