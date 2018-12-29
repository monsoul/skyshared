const merge = require('merge');
const DefinedError = require('../customError').DefinedError;
const jsonMessage = require('./jsonMessage');

function resultHandler(func) {
    return async function (ctx, next) {
        var processInfo = merge({}, ctx.query || {}, ctx.request.body || {}, ctx.params || {});
        
        return Promise.resolve(func.call(ctx, processInfo))
            .then(data => {
                if (data instanceof DefinedError) {
                    ctx.body = jsonMessage.error(data);
                } else {
                    ctx.body = jsonMessage.success(data);
                }
            })
            .catch(err => {
                if (err instanceof Error) {
                    throw err;
                }

                ctx.body = jsonMessage.error(err);
            });
    }
}

module.exports = resultHandler;