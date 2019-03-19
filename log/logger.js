const log4js = require('log4js');
const config = require('../config');
const merge = require('merge')

class Logger {

	constructor(){
		this.init();
	}

    init(localConfig) {
		
        this._config = merge({ }, config.logger, localConfig || {});
		log4js.configure(this._config);
		
		return this;
    }

    get(name, category) {
		let log = log4js.getLogger(category || '');

		if(this._config.appName){
			log.addContext('app-name', this._config.appName);
		}
		log.addContext('log-name', name);

		return log;
    }
}

module.exports = Logger