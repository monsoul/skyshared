const events = require('events');
const logger = require('../../log').get('busClient');

class Publisher extends events.EventEmitter {
    constructor(config) {
        super();
        
        this._config = config;
        this._init();
    }

    _init() {
        const options = this._config.options || {};
        if(this._config.isCluster){
            const redis = require('ioredis');
            this._publisher = new redis.Cluster(this._config.servers, this._config.options || {});
        }else{
            const redis = require('redis');
            this._publisher = redis.createClient(this._config.port, this._config.host, options);
        }
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