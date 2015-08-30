var common  = require('../common');

module.exports = list;

function list(){
    return common.db.listTables();
}
