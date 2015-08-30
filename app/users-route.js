var express = require('express');
var users = require('./users');
var debug = require('debug')('main');

var router = express.Router();

router.get('/', function(req, res, next) {
    users.data.usersdb.scan().then(function(data) {
        res.json(data);
    }, function(err) {
        res.status(404).json(err);
    });
});

router.post('/updatesingle', function(req, res, next) {
    users.updates.single(req.body.username, req.body.env).then(function(data) {
        res.json(data);
    }, function(err) {
        res.status(404).json(err);
    });
});

router.get('/updateall', function(req, res, next) {
    users.updates.all().then(function(val) {
        res.send(val);
    }, function(err) {
        res.status(404).json(err);
    });
});

setInterval(function() {
    users.updates.all();
}, 86400000);
setInterval(function() {
    users.updates.random();
}, 200000);
router.get('/updaterandom', function(req, res, next) {
    users.updates.random().then(function(data) {
        res.json(data);
    }, function(err) {
        res.status(404).json(err);
    });
});

router.post('/notes', function(req, res, next) {
    debug('users-route: /notes');

    var data = {
        username: req.body.username,
        env: req.body.env,
        notes: req.body.notes
    };
    if (data.notes === '') {
        res.status(404).send('Cannot store empty note');
    } else {
        debug('users-route: after data form');
        users.data.usersdb.addNotes(data).then(function(val) {
            res.status(200).json(val);
        }, function(err) {
            res.status(404).json(err);
        });
    }
});

router.post('/', function(req, res, next) {
    var data = {
        username: req.body.username,
        env: req.body.env || req.body.domain
    };

    users.data.usersdb.putItem(data).then(function(val) {
        res.status(200).json(val);
    }, function(err) {
        res.status(404).json(err);
    });
});

router.delete('/delete', function(req, res, next) {
    debug('users-route: deleteitem', req.body);
    users.data.usersdb.deleteItem(req.body.username, req.body.env).then(function(val) {
        res.status(200).json(val);
    }, function(err) {
        res.status(404).json(err);
    });
});

router.post('/verify', function(req, res, next) {
    users.member.verify.account(req.body).then(function(val) {
        res.status(200).json(val);
    }, function(err) {
        res.status(404).json(err);
    });
});

module.exports = router;
