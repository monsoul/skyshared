const util = require('util');
const http = require('http');

function logMessageAppender(config, layout) {
    const appName = config.appName;

    return function(loggingEvent) {
		const appName = util.format(
            '[app-name: %s]',
            (loggingEvent.context && loggingEvent.context['app-name']) ||
                'defalut'
		);

		const logname = util.format(
            '[log-name: %s]',
            (loggingEvent.context && loggingEvent.context['log-name']) ||
                'undefined'
		);
		delete loggingEvent.context['app-name'];
		delete loggingEvent.context['log-name'];

        const espressSession = expressSessionInfo();
        if (espressSession) {
            espressSession.forEach(function(item) {
                loggingEvent.data.push(item);
            });
        }

		const logMessage = layout(loggingEvent);
        const pubMessage = [
            appName,
            logname,
            loggingEvent.level.toString(),
            logMessage,
            loggingEvent.startTime
        ];

        const options = {
            hostname: config.host,
            port: config.port || 10130,
            path: config.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

		const chunks = [];
        const req = http.request(options, function(res) {
            res.on('data', function(chunk) {
                chunks.push(chunk)
            });
            res.on('end', function() {
                console.log(Buffer.concat(chunks).toString());
            });
            res.on('error', function(err, data) {
                console.log(err);
            });
        });
        req.write(JSON.stringify({ code: 'log', data: pubMessage }));
        req.end();
    };
}

/**
 * @private
 * get domian/url/ip from express
 */
function expressSessionInfo() {
    let req;
    if (process.domain) {
        req = process.domain._req;
    }
    if (!req) {
        return;
    }

    const array = [];
    array.push(' -_- ');
    array.push(' -_- ip: "' + req.ip + '"');
    array.push(' -_- ips: "' + req.ips + '"');
    array.push(' -_- hostname: "' + req.hostname + '"');
    array.push(' -_- url: "' + req.originalUrl + '"');
    array.push(' -_- protocol: "' + req.protocol + '"');
    array.push(' -_- cookies: "' + parseJson(req.cookies) + '"');
    array.push(' -_- signedCookies: "' + parseJson(req.signedCookies) + '"');
    array.push(' -_- body: "' + parseJson(req.body) + '"');
    array.push(' -_- xhr: "' + req.xhr + '"');

    Object.keys(req.headers).forEach(function(key) {
        array.push(' -_- ' + key + ': "' + req.headers[key] + '"');
    });

    array.push(' -_- ');

    return array;
}

function parseJson(obj) {
    let json = '';
    try {
        json = JSON.stringify(obj);
    } catch (e) {
        console.log(e);
    }

    return json;
}

function configure(config, layouts) {
    config = config || {};

    let layout = layouts.basicLayout;
    if (config.layout) {
        layout = layouts.layout(config.layout.type, config.layout);
    }

    return logMessageAppender(config, layout);
}

module.exports = {
    configure
};
