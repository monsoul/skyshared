const dateTimeUtil = require('../../util/dateTimeUtil');
const uuidUtil = require('../../util/uuidUtil');

module.exports = function requestTimeMiddleware() {
    return async function(ctx, next) {
		ctx.requestTime = dateTimeUtil.exactUnixTime();
		ctx.serialId = uuidUtil.time_uuid();
		
        await next();
    };
};;