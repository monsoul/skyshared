const redisCache = require('./redis/redisCache');
const util = require('./util');

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
    value = await noCacheDelegate(parameter);
    await cache.set(cacheKey, value, expire);
    return value;
};

cache.init = function(enableCache) {
    if (enableCache) {
        var redisClient = redisCache();

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

            load: function(cacheKey, parameter, isObject, expire, noCacheCallback) {
                return loadx.call(this, cacheKey, parameter, isObject, expire, noCacheCallback);
            }
        };
    } else {
        _cache = {
            set: async function(key, value, expire, wait) {},

            get: async function(key, obj) {
                return null;
            },

            del: async function(key, wait) {},

            load: async function(cacheKey, parameter, isObject, expire, noCacheCallback) {
                if (!noCacheCallback) {
                    return;
                }

                let isAsync = Object.prototype.toString.call(noCacheCallback) === '[object AsyncFunction]';
                if (isAsync) {
                    return await noCacheCallback(parameter);
                } else {
                    return noCacheCallback(parameter);
                }
            }
        };
    }
};

module.exports = cache;