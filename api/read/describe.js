var common  = require('../common');
var d = require('../common/dep');

module.exports = describe;

function describe(params){
    return common.db.describeTable(params.table);
}
