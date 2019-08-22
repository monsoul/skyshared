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

                return;
            }

            if (expire) {
                client.expire(key, expire);
            }

            resolve && resolve(reply);
        });
    };
}

function getRedis(client, key, needParseJSON) {
    return function(resolve, reject) {
        client.get(key, function(err, data) {
            if (err) {
                logger.error(err);
                reject && reject(err);

                return;
            }

            let result;
            if (needParseJSON) {
                result = JSON.parse(data);
            } else {
                result = data;
            }

            resolve && resolve(result);
        });
    }
}

function delRedis(client, key) {
    return function(resolve, reject) {
        client.del(key, function(err, data) {
            if (err) {
                logger.error(err);
                reject && reject(err);

                return;
            }

            resolve && resolve(data);
        });
    }
}

let _client = null;

function redisCache(config) {
    if (!_client) {
		redisClient.init(config);
        _client = redisClient.get(config.name);
    }

    const redisCache = {
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
            return new Promise(getRedis(_client, key, needParseJSON));
        },
        del: function(key, wait) {
            if (wait === true) {
                return new Promise(delRedis(_client, key));
            } else {
                delRedis(_client, key)();
            }
        }
    };

    return redisCache;
};

module.exports = redisCache;