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
                type: "console"
            }
        },
        categories: {
            default: {
                appenders: ["console"],
                level: "DEBUG"
            }
        }
	}
};

module.exports = config;