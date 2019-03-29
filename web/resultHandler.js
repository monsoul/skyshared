const merge = require('merge');
const DefinedError = require('../customError').DefinedError;
const errorCodes = require('../customError').ErrorCodes;
const jsonMessage = require('./jsonMessage');
const log = require('../log').get('resultHandler');

function resultHandler(func) {
    return async function (ctx, next) {
        var processInfo = merge({}, ctx.query || {}, ctx.request.body || {}, ctx.params || {});
        
        return Promise.resolve(func.call(ctx, processInfo))
            .then(data => {
                if (data instanceof DefinedError) {
                    log.error(data);
                    ctx.body = jsonMessage.error(data, ctx);
                } else {
                    ctx.body = jsonMessage.success(data, ctx);
                }
            })
            .catch(err => {
                log.error(err);

				if(err instanceof DefinedError){
                    ctx.body = jsonMessage.error(err, ctx);
				}
				else if (err instanceof Error) {
                    ctx.body = jsonMessage.error(new DefinedError(errorCodes.SERVER_ERROR.errorCode, errorCodes.SERVER_ERROR.message), ctx);
                }
            });
    }
}

module.exports = resultHandler;