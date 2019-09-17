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
				host: 'nas.hcdglobal.cn',
				port: 9253
			}
        },
        categories: {
            default: {
                appenders: ["file", 'logMessage'],
                level: "ERROR"
            }
        }
    }
};

module.exports = config;