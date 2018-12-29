const merge = require('merge');
const config = require('../config');
const dbFactory = require('./dbFactory');

module.exports = function(setting){
    const mergeSetting = merge({}, config.connectionSettings, (setting || {}));

    return dbFactory.init(mergeSetting);
}