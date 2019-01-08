const logPath = process.env.LOG_PATH;

var config = {
	appName: 'skyShared',
    redis: {
        host: 'dev.redis.server',
        port: 6379,     
        options: {
            password: '123456'
        }
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