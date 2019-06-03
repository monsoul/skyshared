const globalConfig = require('../config');
const util = require('util');
const logger = require('../log').get('messageBus');

const BUS_TYPES = {
    REDIS_SUB_PUB: 1
};

class PublisherFactory {

    constructor() {
        this._publisherMap = {};
    }

    create(config, busType) {
        busType = busType || 1;

        let publisher = this._publisherMap[busType];
        if (!publisher) {
            this._config = config || globalConfig.redis;

            publisher = this._create(busType);
            this._publisherMap[busType] = publisher;
        }

        return publisher;
    }

    _create(busType) {
        if (busType === 1) {
            const RedisPub = require('./redis/publisher');

            return new RedisPub(this._config);
        }
        else {
            logger.error(util.format('Invalid bus type(%s) of message bus where creating a publisher.', busType));
        }
    }
}

class SubscriberFactory {
    constructor() {
        this._subscriberMap = {};
    }

    create(config, busType) {
        busType = busType || 1;

        let subscriber = this._subscriberMap[busType];
        if (!subscriber) {
            this._config = config || globalConfig.redis;

            subscriber = this._create(busType);
            this._subscriberMap[busType] = subscriber;
        }

        return subscriber;
    }

    _create(busType) {
        if (busType === 1) {
            const RedisSub = require('./redis/subscriber');

            return new RedisSub(this._config);
        }
        else {
            logger.error(util.format('Invalid bus type(%s) of message bus where creating a subscriber.', busType));
        }
    }
}

module.exports = {
    BUS_TYPES: BUS_TYPES,
    publisherFactory: new PublisherFactory(),
    subscriberFactory: new SubscriberFactory()
}