const dateTimeUtil = require('../../util/dateTimeUtil');
const uuidUtil = require('../../util/uuidUtil');

module.exports = function headResultMiddleware() {
    return async function(ctx, next) {
		ctx.headResult = true;
		
        await next();
    };
};;