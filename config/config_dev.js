const logPath = process.env.LOG_PATH;

var config = {
	appName: 'skyShared',
    redis: {
        host: '10.211.55.5',
        port: 6379
    },
    logger: {
        appenders: {
            console: {
                type: 'console'
			},
			logMessage: {
				type: 'skyshared/log/appender/logMessageAppender',
				host: '10.20.32.61',
				port: 10130,
				path: '/publish'
			}
        },
        categories: {
            default: {
                appenders: ['console'],
                level: 'DEBUG'
            }
        }
	}
};

module.exports = config;