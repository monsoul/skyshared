var config = {
	appName: 'skyShared',
    redis: {"host":"live.redis.server","port":6379},
    logger: {
        appenders: {
            console: {
                type: "console"
            },
            file: {
                type: "file",
                maxLogSize: 1024 * 1024 * 50,
                filename: 'logs/' + new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + '.log',
                backups: 3
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