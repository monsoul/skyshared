const redis = require('ioredis');
const util = require('util');
const DefinedError = require('../../customError').DefinedError;
const ErrorCodes = require('../../customError').ErrorCodes;
const logger = require('../../log').get('redisClient');

const DEFAULT_NAME = '__default__';
let _redisClient = null;

class RedisClient {

    constructor(config) {
        this._config = config;
        this.clients = {};
    }

    _createClient(name) {
        const client = new redis.Cluster(this._config.servers, this._config.options || {});

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
            logger.error('failed to create the', name, 'of cluster redis client');

            throw new DefinedError(ErrorCodes.CACHE_INIT_ERROR, util.format('failed to create the %s of cluster redis client', name))
        }

        return client;
    }
}

module.exports = {
    init: function(config) {
        if (_redisClient) {
            return _redisClient;
        }

        if (!config) {
            throw new DefinedError(ErrorCodes.CACHE_INIT_ERROR, 'invalid cluster redis configuration.');
        }

        _redisClient = new RedisClient(config);
    },
    get: function(name) {
        if (!_redisClient) {
            throw new DefinedError(ErrorCodes.CACHE_INIT_ERROR, 'can not initialize a redis client.');
        }

        return _redisClient.getClient(name);
    }
}