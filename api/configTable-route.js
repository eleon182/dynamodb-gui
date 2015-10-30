var express = require('express');
var debug = require('debug')('main');
var router = express.Router();

var configTable = require('./configTable');
router.get('/', function(req, res, next) {
    configTable.get(function(err, data){
        if(err){
            res.json([]);
        }
        else {
            res.json(data);
        }
    });
});

module.exports = router;
