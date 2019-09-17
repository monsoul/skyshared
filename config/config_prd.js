var config = {
    appName: 'skyShared',
    redis: {
        host: 'live.redis.server',
        port: 6379
    },
    logger: {
        appenders: {
            console: {
                type: "console"
            },
            file: {
                type: "file",
                maxLogSize: 1024 * 1024 * 50,
                filename: "logs/log.log"
            },
            logMessage: {
                type: 'skyshared/log/appender/logMessageAppender',
                host: '10.20.32.61',
                port: 10130,
                path: '/publish'
            },
            logstash: {
                type: '@log4js-node/logstashudp',
                host: 'hz.liveq.net',
                port: 9252
            }
        },
        categories: {
            default: {
                appenders: ["file", ],
                level: "ERROR"
            }
        }
    }
};

module.exports = config;