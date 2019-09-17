const util = require('util');
const http = require('http');
const log4js = require('log4js');
const dgram = require('dgram');


function logMessageAppender(config, layout) {
    const appName = config.appName;
    return function log(loggingEvent) {
        const appName = (loggingEvent.context && loggingEvent.context['app-name']) || 'defalut';
        const logname = (loggingEvent.context && loggingEvent.context['log-name']) || 'undefined';
        delete loggingEvent.context['app-name'];
        delete loggingEvent.context['log-name'];

        if (loggingEvent.data[loggingEvent.data.length - 1] == undefined) {
            loggingEvent.data[loggingEvent.data.length - 1] = 'undefined';
        }
        const logObject = {
            "@version": "1",
            "@timestamp": (new Date(loggingEvent.startTime)).toISOString(),
            "type": config.logType,
            "message": layout(loggingEvent),
            "level": loggingEvent.level.levelStr,
            "appname": appName,
            "category": logname,
            "createdate": loggingEvent.startTime,
            "datacenter": process.env.DATACENTER || 'local'
        };

        const espressSession = expressSessionInfo();

        if (espressSession) {
            for (const name in espressSession) {
                logObject[name] = espressSession[name];
            }
        }

        if (config.fields) {
            for (const field_name in config.fields) {
                logObject[field] = config.fields[field_name];
            }
        }
        const udp = dgram.createSocket('udp4');
        sendLog(udp, config.host, config.port, logObject);
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

    const exItem = {};
    exItem['ip'] = req.ip;
    exItem['ips'] = req.ips;
    exItem['hostname'] = req.hostname;
    exItem['url'] = req.originalUrl;
    exItem['protocol'] = req.protocol;
    exItem['cookies'] = parseJson(req.cookies);
    exItem['signedCookies'] = parseJson(req.signedCookies);
    exItem['body'] = parseJson(req.body);
    exItem['xhr'] = req.xhr;

    Object.keys(req.headers).forEach(function(key) {
        exItem[key] = req.headers[key];
    });

    return exItem;
}

function parseJson(obj) {
    const str = '';
    try {
        str = JSON.stringify(obj);
    } catch (e) {
        // ignore
    }

    return str;
}

function sendLog(udp, host, port, logObject) {
    const buffer = new Buffer(JSON.stringify(logObject));
    udp.send(buffer, 0, buffer.length, port, host, function(err, bytes) {
        if (err) {
            console.error(
                "log4js.logstashUDP - %s:%p Error: %s", host, port, util.inspect(err)
            );
        }
    });
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