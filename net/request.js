const http = require('http');
const config = require('../config');
const logger = require('../log').get('request');
const jsonMessage = require('../web/jsonMessage');
const DefinedError = require('../customError').DefinedError;
const ErrorCodes = require('../customError').ErrorCodes;

module.exports = function(data, options) {
    options = {
        host: options.host,
        port: options.port,
        path: (options.urlPrefix || '') + options.url,
        method: options.method || 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'User-Agent': options.appName || config.appName
        }
    };

    return new Promise((resolve, reject) => {
		let json;
		if(data){
			json = JSON.stringify(data);
			options.headers['Content-Length'] = json.length;
		}

        var req = http.request(options, resolve);

        if (data) {
            req.write(json);
        }

        req.on('error', reject);
        req.end();
    }).then((res) => {
        return new Promise(function(resolve, reject) {
            const chunks = [];
            res.on('data', function(chunk) {
                chunks.push(chunk)
            });

            res.on('end', function() {
                if (res.statusCode == '200') {
                    resolve(JSON.parse(Buffer.concat(chunks).toString()));
                } else {
                    logger.error({
                        statusCode: res.statusCode,
                        statusMessage: res.statusMessage,
                        body: Buffer.concat(chunks).toString()
                    });

                    resolve(jsonMessage.error(
								new DefinedError(
									ErrorCodes.REMOTE_SERVICE_ERROR.errorCode,
									ErrorCodes.REMOTE_SERVICE_ERROR.message
                    )));
                }
            });

            res.on('error', function(e) {
                logger.error(e);
                reject(e);
            })
        });
    }).catch(e => {
        logger.error(e);

        return new Promise(function(resolve, reject) {
            reject(e);
        });
    });
};