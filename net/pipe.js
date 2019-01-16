const http = require('http');
const config = require('../config');
const logger = require('../log').get('pipe');
const jsonMessage = require('../web/jsonMessage');
const DefinedError = require('../customError').DefinedError;
const ErrorCodes = require('../customError').ErrorCodes;

const PAYLOAD_METHODS = ['POST', 'PUT', 'PATCH'];

module.exports = function(ctx, next, options) {
	const request = ctx.request;
	
    options = {
        host: options.host,
        port: options.port,
        path: (options.urlPrefix || '') + (options.url || request.url),
        method: options.method || request.method || 'post',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'User-Agent': options.appName || config.appName
        }
	};
	
    const hasPayload = request.body && PAYLOAD_METHODS.indexOf(request.method) >= 0;

    if (hasPayload) {
        var data = JSON.stringify(request.body);
        options.headers['Content-Length'] = Buffer.byteLength(data);
    }

    return new Promise((resolve, reject) => {
        var req = http.request(options, resolve);
        if (hasPayload) {
            req.write(data);
        }
        req.on('error', reject);
        req.end();
    }).then((res) => {
        if (res.statusCode != '200') {
			const chunks = [];
			
            res.on('data', function(chunk) {
                chunks.push(chunk)
			});
			
            res.on('end', function() {
                logger.error({
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage,
                    body: Buffer.concat(chunks).toString()
                });
            });
        }

        ctx.response.body = res;
        Object.keys(res.headers).forEach((key) => {
            ctx.response.set(key, res.headers[key]);
        });
    }).catch(e => {
        logger.error(e);

        ctx.response.body = jsonMessage.error(
			new DefinedError(
				ErrorCodes.REMOTE_SERVICE_ERROR.errorCode, 
				ErrorCodes.REMOTE_SERVICE_ERROR.message
		), ctx);
    });
};