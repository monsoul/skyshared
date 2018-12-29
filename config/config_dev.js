const logPath = process.env.LOG_PATH;

var config = {
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