const logPath = process.env.LOG_PATH;

var config = {
	appName: 'skyShared',
    redis:{host:'uat.redis.server',port:6379},
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
                host: 'uat.logstash.com',
                port: 9252
            }
        },
        categories: {
            default: {
                appenders: ["file", 'logMessage'],
                level: 'DEBUG'
            }
        }
	}
};

module.exports = config;