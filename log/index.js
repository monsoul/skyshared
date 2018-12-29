const Logger = require('./logger');

const logger = new Logger();

module.exports = {
    init: function(setting) {
        return logger.init(setting);
    },
    get: function(name, category) {
        return logger.get(name, category);
    }
}