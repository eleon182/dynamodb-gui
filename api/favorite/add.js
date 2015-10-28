var fs = require('fs');
var path = require('path');

var favoriteList;

module.exports = add;

function add(table, callback){
    var file = path.join(__dirname, 'favoriteList.json');
    fs.exists(file, function (exists){
        if(exists){
            favoriteList = require('./favoriteList');
        }
        else {
            favoriteList = [];
        }
        favoriteList.push(table);
        fs.writeFile(file, JSON.stringify(favoriteList), function(err) {
            callback();
        });
    });
}
