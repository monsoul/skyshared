const merge = require('merge');
const config = require('../config');
const dbFactory = require('./dbFactory');

module.exports = {
    init: function(setting) {
        const mergeSetting = merge({}, config.connectionSettings, (setting || {}));

        return dbFactory.init(mergeSetting);
    },
    get: function(dbName) {
        return dbFactory.getSequelize(dbName);
    }
}