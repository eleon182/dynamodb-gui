var fs = require('fs');
var path = require('path');

var favoriteList;

module.exports = deleteItem;

function deleteItem(table, callback){
    var file = path.join(__dirname, 'favoriteList.json');
    fs.exists(file, function (exists){
        if(exists){
            favoriteList = require('./favoriteList');

            fs.writeFile(file, JSON.stringify(removeItem(table, favoriteList)), function(err) {
                return callback();
            });
        }
        else {
            return callback();
        }
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
