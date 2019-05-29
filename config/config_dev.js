const logPath = process.env.LOG_PATH;

var config = {
	appName: 'skyShared',
    redis: {
        host: '10.20.32.250',
		port: 6379,
		options: {
			db: 3
		}
    },
    logger: {
        appenders: {
            console: {
                type: 'console'
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
			}
        },
        categories: {
            default: {
                appenders: ['console', 'file'],
                level: 'DEBUG'
            }
        }
	}
};

module.exports = config;