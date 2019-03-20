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
                maxLogSize: 1024 * 1024 * 500,
                filename: "logs/log.log"
			}
			/*,
			logMessage: {
				type: 'log/appender/logMessageAppender',
				host: 'service.hcdlearning.com',
				port: 10130,
				path: '/publish'
			}*/
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