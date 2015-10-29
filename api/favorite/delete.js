var fs = require('fs');
var path = require('path');

var favoriteList;

module.exports = deleteItem;

function deleteItem(table, callback){
    var file = path.join(__dirname, 'favoriteList.json');
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return callback();
        }
        else {
            favoriteList = removeItem(table, JSON.parse(data));
        }
        fs.writeFile(file, JSON.stringify(favoriteList), function(err) {
            callback();
        });
    });
}

function removeItem(table, list){
    var response = [];
    list.forEach(function(val){
        if(val != table){
            response.push(val);
        }
    });
    return response;
}
