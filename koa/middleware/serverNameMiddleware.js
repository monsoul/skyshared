const os = require('os');
const hostName = os.hostname();

module.exports = function serverNameMiddleware() {
    return async function(ctx, next) {
		await next();
		ctx.set('X-Server', hostName);
    };
};