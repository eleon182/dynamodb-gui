var common  = require('../common');

module.exports = scan;

function scan(params){
    console.log(params);
    return common.db.scan(params.table);
}
