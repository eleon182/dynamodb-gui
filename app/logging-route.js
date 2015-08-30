var express = require('express');
var debug = require('debug')('main');
var router = express.Router();

var logging = require('./logging');

router.get('/', function(req, res, next) {
    debug('logging-route: get');
    logging.db.scan().then(function(data) {
        data.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });
        var response = [];
        var threshold = 604800000;
        var today = new Date().getTime();
        data.forEach(function(val) {
            // console.log(today - new Date(val.date).getTime());
            if ((today - new Date(val.date).getTime()) < threshold) {
                response.push(val);
            }
        });
        res.json(response);
    }, function(err) {
        res.status(404).json(err);
    });
});
setInterval(function() {
    logging.process.check();
}, 300000);
router.get('/process', function(req, res, next) {
    debug('logging-route: process');
    logging.process.check();
    res.send('OK');
});

module.exports = router;
