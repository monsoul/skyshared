const redis = require('redis');
const util = require('util');
const config = require('../../config');
const DefinedError = require('../../customError').DefinedError;
const ErrorCodes = require('../../customError').ErrorCodes;
const logger = require('../../log').get('redisClient');

const DEFAULT_NAME = 'default_redis_client';

class RedisClient {

    constructor() {
        this.clients = {};
    }

    _createClient(name) {
        const client = redis.createClient(config.redis.port, config.redis.host, config.redis.options || {});

        client.on('error', function(err) {
            logger.fatal('redis client (%s) error', name, err);
        });

        return client;
    }

    getClient(name) {
        if (!name) {
            name = DEFAULT_NAME;
        }

        let client = this.clients[name];
        if (!client) {
            client = this._createClient(name);
            this.clients[name] = client;
        } else {
            logger.error('failed to create the', name, 'redis client');

            throw new DefinedError(ErrorCodes.CACHE_INIT_ERROR, util.format('failed to create the %s redis client', name))
        }

        return client;
    }
}

let _redisClient = null;

module.exports = function(name) {
    if (!_redisClient) {
        _redisClient = new RedisClient();
    }

    return _redisClient.getClient(name);
};