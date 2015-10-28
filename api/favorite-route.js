var express = require('express');
var debug = require('debug')('main');
var router = express.Router();

var favorite = require('./favorite');
router.get('/list', function(req, res, next) {
    res.json(favorite.scan());
});

router.get('/add', function(req, res, next) {
    if(req.query.table){
        favorite.add(req.query.table, function(){
            res.end();
        });
    }
    else {
        res.status(404).end();
    }
});

module.exports = router;
