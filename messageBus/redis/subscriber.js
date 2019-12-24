const events = require('events');
const logger = require('../../log').get('busClient');

class Subscriber extends events.EventEmitter {
    constructor(config) {
        super();

        this._config = config;
        this._init();
    }

    _init() {
        const options = this._config.options || {};
        if(this._config.isCluster){
            const redis = require('ioredis');
            this._subscriber = new redis.Cluster(this._config.servers, this._config.options || {});
        }else{
            const redis = require('redis');
            this._subscriber = redis.createClient(this._config.port, this._config.host, options);
        }
        this._subscriber.on('error', function (err) {
            logger.error('The subscriber of redis (%s) error', err);
        });
        this._subscriber.on('subscribe', function (channel, count) {
            logger.info('channel: %s, count: %s', channel, count);
        });

        const me = this;
        this._subscriber.on('message', function (channel, message) {
            logger.info('subscribe channel: %s, message: %s', channel, message);

            me.emit('message', {
                channel: channel,
                data: message
            });
        });
    }

    subscribe(channel) {
        if (!channel) {
            return;
        }

        this._channels = this._channels || {};

        if (this._channels[channel]) {
            return;
        }

        this._channels[channel] = true;

        this._subscriber.subscribe(channel, function (err) {
            if (err) {
                logger.error('Fail to subscribe channel(%s)(%s)', channel, err);
            }
        });
    }
}

module.exports = Subscriber;