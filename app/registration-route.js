var express = require('express');
var debug = require('debug')('main');
var registration = require('./registration');

var router = express.Router();

router.post('/step1', function(req, res, next) {
    registration.step1(req.body).then(function(data) {
        res.status(200).json(data);
    }, function(err) {
        res.status(404).json(err);
    });
});
router.post('/step2', function(req, res, next) {
    registration.step2(req.body).then(function(data) {
        res.status(200).json(data);
    }, function(err) {
        res.status(404).json(err);
    });
});
router.post('/step3', function(req, res, next) {
    registration.step3(req.body).then(function(data) {
        res.status(200).json(data);
    }, function(err) {
        res.status(404).json(err);
    });
});
router.post('/step4', function(req, res, next) {
    registration.step4(req.body).then(function(data) {
        res.status(200).json(data);
    }, function(err) {
        res.status(404).json(err);
    });
});
router.post('/step5', function(req, res, next) {
    registration.step5(req.body).then(function(data) {
        res.status(200).json(data);
    }, function(err) {
        res.status(404).json(err);
    });
});
router.post('/step6', function(req, res, next) {
    registration.step6(req.body).then(function(data) {
        res.status(200).json(data);
    }, function(err) {
        res.status(404).json(err);
    });
});
router.post('/step7', function(req, res, next) {
    registration.step7(req.body).then(function(data) {
        res.status(200).json(data);
    }, function(err) {
        res.status(404).json(err);
    });
});
router.post('/step8', function(req, res, next) {
    registration.step8(req.body).then(function(data) {
        res.status(200).json(data);
    }, function(err) {
        res.status(404).json(err);
    });
});
router.post('/token', function(req, res, next) {
    registration.token(req.body).then(function(data) {
        res.status(200).json(data);
    }, function(err) {
        res.status(404).json(err);
    });
});

module.exports = router;
