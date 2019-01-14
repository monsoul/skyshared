const util = require('util');
const events = require('events');
const Sequelize = require('sequelize');
const ErrorCodes = require('../customError').ErrorCodes;
const DefinedError = require('../customError').DefinedError;

let factory;

class DbFactory extends events.EventEmitter {
    constructor(settings) {
        super();

        this.settings = settings;
        this.sequelizeMap = {};
    }

    getSequelize(dbName){
        let one = this.sequelizeMap[dbName];
        if(!one){
            const setting = this.settings[dbName];
            if(!setting){
                throw new DefinedError(ErrorCodes.DB_NOT_EXISTS.errorCode, util.format('The %s database does not exist.', dbName));
            }

            one = new Sequelize(setting.database, setting.userName, setting.password, setting.options);
            this.sequelizeMap[dbName] = one;
        }

        return one;
    }
}

function init(settings){
    if(!settings){
        throw new DefinedError(ErrorCodes.INVALID_DB_SETTINGS.errorCode, ErrorCodes.INVALID_DB_SETTINGS.message);
    }

	factory = new DbFactory(settings);
	
	return factory;
}

module.exports = {
    init,
    getSequelize: function(dbName){
        if(!factory){
            throw new DefinedError(ErrorCodes.DB_INIT_ERROR.errorCode, ErrorCodes.DB_INIT_ERROR.message);
        }

        return factory.getSequelize(dbName);
    }
}
