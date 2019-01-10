const redisCache = require('./redis/redisCache');

let _cache = null;

function cache() {
    if (!_cache) {
        throw new Error('error, cache should be initialized fist.');
    }

    return _cache;
};

async function loadx(cacheKey, parameter, isObject, expire, noCacheDelegate) {
    var cache = this;
    let value = await cache.get(cacheKey, isObject);
    if (value) {
        return value;
    }

    if (!noCacheDelegate) {
        return;
    }

    let isAsync = Object.prototype.toString.call(noCacheDelegate) === '[object AsyncFunction]';
    if (isAsync) {
        value = await noCacheDelegate(parameter);
    } else {
        value = noCacheDelegate(parameter);
    }

    cache.set(cacheKey, value, expire);

    return value;
};

cache.init = function(config) {
    if (!config) {
        config = require('../config').redis;
        config.enable = true;
    }

    if (config.enable) {
        var redisClient = redisCache(config);

        _cache = {
            set: function(key, value, expire, wait) {
                return redisClient.set(key, value, expire, wait);
            },

            get: function(key, obj) {
                return redisClient.get(key, obj);
            },

            del: function(key, wait) {
                return redisClient.del(key, wait);
            },

            load: function(cacheKey, parameter, isObject, expire, noCacheDelegate) {
                return loadx.call(this, cacheKey, parameter, isObject, expire, noCacheDelegate);
            }
        };
    } else {
        _cache = {
            set: async function(key, value, expire, wait) {},

            get: async function(key, obj) {},

            del: async function(key, wait) {},

            load: async function(cacheKey, parameter, isObject, expire, noCacheDelegate) {
                if (!noCacheDelegate) {
                    return;
                }

                let isAsync = Object.prototype.toString.call(noCacheDelegate) === '[object AsyncFunction]';
                if (isAsync) {
                    return await noCacheDelegate(parameter);
                } else {
                    return noCacheDelegate(parameter);
                }
            }
        };
    }
};

module.exports = cache;