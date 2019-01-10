const os = require('os');
const hostName = os.hostname();

module.exports = function() {
    return async function healthCheck(ctx, next) {
        let url = ctx.request.url;
        if (url == '/healthcheck') {
            ctx.body = {
                everything: 'is ok',
                time: new Date(),
                hostName: hostName
            };

            return;
        }

        await next();
    };
};