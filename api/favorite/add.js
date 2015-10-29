var fs = require('fs');
var path = require('path');

var favoriteList;

module.exports = add;

function add(table, callback){
    var file = path.join(__dirname, 'favoriteList.json');
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            favoriteList = [];
        }
        else {
            favoriteList = JSON.parse(data);
        }
        favoriteList.push(table);
        fs.writeFile(file, JSON.stringify(favoriteList), function(err) {
            callback();
        });
    });
}
