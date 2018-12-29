const util = require('util');
const log4js = require('log4js');
const config = require('../config');
const merge = require('merge')

const NAME_DESC = '[name: %s]:';

class Logger {

	constructor(){
		this.init();
	}

    init(localConfig) {
        let tmpConfig = {};
        tmpConfig = merge(tmpConfig, config.logger, localConfig || {});
		log4js.configure(tmpConfig);
		
		return this;
    }

    get(name, category) {
        let me = this;

        category = category || '';
        let log = log4js.getLogger(category);
        return {
            fatal: function() {
                let args = Array.prototype.slice.call(arguments);
                args = me._addNameDesc(args, name);
                log.fatal.apply(log, args);
            },
            error: function() {
                let args = Array.prototype.slice.call(arguments);
                args = me._addNameDesc(args, name);
                log.error.apply(log, args);
            },
            warn: function() {
                let args = Array.prototype.slice.call(arguments);
                args = me._addNameDesc(args, name);
                log.warn.apply(log, args);
            },
            info: function() {
                let args = Array.prototype.slice.call(arguments);
                args = me._addNameDesc(args, name);
                log.info.apply(log, args);
            },
            debug: function() {
                let args = Array.prototype.slice.call(arguments);
                args = me._addNameDesc(args, name);
                log.debug.apply(log, args);
            },
            trace: function() {
                let args = Array.prototype.slice.call(arguments);
                args = me._addNameDesc(args, name);
                log.trace.apply(log, args);
            }
        };
    }

    _addNameDesc(args, name){
        args = args || [];
        args.unshift(util.format(NAME_DESC, name));

        return args;
    }
}

module.exports = Logger