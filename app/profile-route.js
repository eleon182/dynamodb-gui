var express = require('express');
var debug = require('debug')('main');
var router = express.Router();

var employee = require('./employee');

router.post('/updatepassword', function(req, res, next) {
    req.body.password = req.body.oldPassword;
    employee.validate(req.body).then(function() {
            employee.utility.updatePassword(req.body).then(function() {
                    res.end();
                },
                function(err) {
                    res.status(404).json(err);
                });
        },
        function(err) {
            res.status(404).json(err);
        });
});
router.get('/getName', function(req, res, next) {
    employee.utility.getUser(req.body.employeeUsername).then(function(val) {
        var response = {
            firstName: val.firstName,
            lastName: val.lastName,
            username: val.username
        };
        res.json(response);
    }, function(err) {
        res.status(404).json(err);
    });
});

module.exports = router;
