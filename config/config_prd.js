var config = {
	appName: 'skyShared',
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
        },
        categories: {
            default: {
                appenders: ["file"],
                level: "ERROR"
            }
        }
    }
};

module.exports = config;