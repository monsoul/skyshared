const crypto = require('crypto');
const util = require('util');
const typeUtil = require('./typeUtil');

function md5(content) {
    if (!content) {
        return '';
    }

    let hash = crypto.createHash('md5');
    hash.update(content);

    return hash.digest('base64');
}

function sha256(content) {
    if (!content) {
        return '';
    }

    let hash = crypto.createHash('sha256');
    hash.update(content);

    return hash.digest('base64');
}

function hmac(key, content, algorithm) {
    if (!content) {
        return '';
    }

    algorithm = algorithm || 'sha1';
    return crypto.createHmac(algorithm, key).update(content).digest('base64');
}

function signQueryString(secret, params) {
    let str = '';
    if (typeUtil.isString(params)) {
        str = params;
    } else {
        params = params || {};

        let keys = [];
        for (var key in params) {
            keys.push(key);
        }

        keys.sort();

        keys.forEach(key => {
            const value = params[key];

            if (typeUtil.isObject(value)) {
                str += util.format('%s=%s&', key, encodeURIComponent(JSON.stringify(params[key])));
            }
            else {
                str += util.format('%s=%s&', key, encodeURIComponent(value));
            }
        });

        str = str.substr(0, str.length - 1);
    }

    return {
        signature: hmac(secret, str).toLowerCase(),
        content: str
    };
}

module.exports = {
    md5: md5,
    sha256: sha256,
    hmac: hmac,
    signQueryString: signQueryString
}