const http = require('http');
const log = require('../log').get('request');
const appName = require('../config').appName;

module.exports = function(data, options) {
    options = {
        host: options.host,
        port: options.port,
        path: (options.servicePrefix || '') + options.url,
        method: options.method || 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'User-Agent': options.appName || appName
        }
    };

    return new Promise((resolve, reject) => {
        var req = http.request(options, resolve);

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.on('error', reject);
        req.end();
    }).then((res) => {
        return new Promise(function(resolve, reject) {
            const chunks = []
            res.on('data', function(chunk) {
                chunks.push(chunk)
            })
            res.on('end', function() {
                if (res.statusCode == '200') {
                    resolve(JSON.parse(Buffer.concat(chunks).toString()));
                } else {
                    log.error({
                        statusCode: res.statusCode,
                        statusMessage: res.statusMessage,
                        body: Buffer.concat(chunks).toString()
                    });

                    resolve({
                        isSuccess: false,
                        status: res.statusCode,
                        message: 'remote server error'
                    });
                }
            });
            res.on('error', function(e) {
                log.error(e);
                reject(e);
            })
        });
    }).catch(e => {
        log.error(e);

        return new Promise(function(resolve, reject) {
            reject(e);
        });
    });
};