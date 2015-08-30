var express = require('express');
var debug = require('debug')('main');
var router = express.Router();

var read = require('./read');

router.post('/scan', function(req, res, next) {
    read.scan(req.body).then(
        function(data) {
            res.json(data);
        },
        function(err) {
            res.status(500).json(err);
        });
});

router.get('/describe', function(req, res, next) {
    table.describe(req.query).then(
        function(data) {
            res.json(data);
        },
        function(err) {
            res.status(500).json(err);
        });
});

module.exports = router;
