var fs = require('fs');
var path = require('path');
var favoriteList;

module.exports = getList;

function getList(){
    var file = path.join(__dirname, 'favoriteList.json');
    if(fs.existsSync(file)){
        return require('./favoriteList');
    } else {
        return [];
    }
}
