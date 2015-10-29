var fs = require('fs');
var path = require('path');
var favoriteList;

module.exports = getList;

function getList(callback){
    var file = path.join(__dirname, 'favoriteList.json');
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            callback(err, data);
        }
        else {
            callback(null, JSON.parse(data));
        }
    });
}
