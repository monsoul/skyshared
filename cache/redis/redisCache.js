const logger = require('../../log').get('cache');
const redisClient = require('./redisClient');

function setRedis(client, key, value, expire) {
    return function(resolve, reject) {
        if (value == undefined) {
            return resolve && resolve(null);
        }
        client.set(key, value, function(err, reply) {
            if (err) {
                logger.error(err);
                reject && reject(err);
            }
            if (expire) {
                client.expire(key, expire);
            }
            resolve && resolve(reply);
        });
    };
}

function removeRedis(client, key) {
    return function(resolve, reject) {
        client.del(key, function(err, data) {
            if (err) {
                logger.error(err);
                reject && reject(err);
            } else {
                resolve && resolve(data);
            }
        });
    }
}

let _client = null;

function redisCache() {
    if (!_client) {
        _client = redisClient();
    }

    var redisCache = {
        set: function(key, value, expire, wait) {
            var stringfiedValue = value;
            if (typeof(value) === 'object') {
                stringfiedValue = JSON.stringify(value);
            }

            if (wait === true) {
                return new Promise(setRedis(_client, key, stringfiedValue, expire));

            } else {
                setRedis(_client, key, stringfiedValue, expire)();
            }
        },

        get: function(key, needParseJSON) {
            return new Promise(function(resolve, reject) {
                _client.get(key, function(err, reply) {
                    if (err) {
                        logger.error(err);
                        reject(err);
                    }

                    var result;
                    if (needParseJSON && reply) {
                        try {
                            result = JSON.parse(reply);
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        result = reply;
                    }
                    resolve(result);
                });
            });
        },
        del: function(key, wait) {
            if (wait === true) {
                return new Promise(removeRedis(_client, key));
            } else {
                removeRedis(_client, key)();
            }
        }
    };

    return redisCache;
};

module.exports = redisCache;