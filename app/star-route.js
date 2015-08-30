var express = require('express');
var debug = require('debug')('main');
var star = require('./star');

var router = express.Router();

router.get('/getanswers', function(req, res, next) {
    star.db.getAnswers(req.query.ssn).then(function(val) {
        debug('star-route getanswers done', val);
        res.json(val);
    }, function(err) {
        res.status(404).json(err);
    });
});
router.get('/findusers', function(req, res, next) {
    star.db.search(req.query.name).then(function(val) {
        res.json(val);
    }, function(err) {
        res.status(404).json(err);
    });
});

router.get('/getall', function(req, res, next) {
    star.db.scan().then(function(val) {
        res.json(val);
    }, function(err) {
        res.status(404).json(err);
    });
});
//router.post('/submitanswers', function(req, res, next) {
    //funnel.submitAnswers(req.body).then(function(response) {
        //res.status(200).json(response);
    //}, function(err) {
        //res.status(404).json(err);
    //});
//});

//router.post('/create', function(req, res, next) {
    //debug('funnel-route, create');
    //star.getUser(req.body.ssn).then(function(data) {
        //debug('funnel-route, create');
        //req.body.user = data;
        //funnel.createUser(req.body).then(function(val) {
            //res.status(200).json(val);
        //}, function(err) {
            //res.status(404).json(err);
        //});
    //}, function(err) {
        //res.status(404).json({
            //code: 'User not found'
        //});
    //});
//});

module.exports = router;
