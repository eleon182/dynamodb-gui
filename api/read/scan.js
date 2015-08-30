var common  = require('../common');

module.exports = scan;

function scan(params){
    return common.db.scan(params.table);
}
