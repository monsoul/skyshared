const events = require('events');
const redis = require('redis');
const logger = require('../../log').get('busClient');

class Publisher extends events.EventEmitter {
    constructor(config) {
        this._config = config;
        
        this._init();
    }

    _init() {
        const options = this._config.options || {};

        this._publisher = redis.createClient(this._config.port, this._config.host, options);
        this._publisher.on('error', function (err) {
            logger.error('The publisher of redis (%s) error', err);
        });
    }

    publish(channel, message, isObj) {
        if (isObj !== true) {
            message = JSON.stringify(message);
        }

        this._publisher.publish(channel, message, function (err) {
            if (err) {
                logger.error('Fail to publish a message(%s)', message);
            }
        });
    }
}

module.exports = Publisher;