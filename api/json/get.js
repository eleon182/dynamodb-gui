var fs = require('fs');
var path = require('path');
module.exports = get;

function get(table){
    var file = path.join(__dirname, table+'.json');
    if(fs.existsSync(file)){
        return require('./' + table + '.json');
    } else {
        return false;
    }
}
