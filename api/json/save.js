var fs = require('fs');
var path = require('path');

var favoriteList;

module.exports = add;

function add(table, data, callback){
    var file = path.join(__dirname, table +  '.json');
    fs.writeFile(file, JSON.stringify(data), function(err) {
        callback();
    });
}
