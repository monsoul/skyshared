const env = require('../../env');
const envs = require('../../constant').envs;
const jsonMessage = require('../../web/jsonMessage');
const DefinedError = require('../../customError').DefinedError;
const ErrorCodes = require('../../customError').ErrorCodes;

let isProduction = env === envs.prd;

module.exports = function customErrorMiddleware(options) {
    options = options || {};

    async function jsonError(ctx, err) {
        let previewStatus = ctx.status;

        if (ctx.status == 404) {
            ctx.body = {
                'server': 'unknown error'
            };

            ctx.status = previewStatus;
        } else if (ctx.status >= 500) {
            ctx.body = jsonMessage.error(new DefinedError(ErrorCodes.SERVER_ERROR.errorCode, ErrorCodes.SERVER_ERROR.message));

            if (!isProduction) {
                ctx.body.message = err.message;
            }

            ctx.status = previewStatus;
        }
    }

    async function htmlError(ctx, err) {
        if (ctx.render) {
            let previewStatus = ctx.status;

            if (ctx.status == 404) {
                if (options.view_404) {
                    await ctx.render(options.view_404, options.custom ? options.custom(err) : err);
                    ctx.status = previewStatus;
                }
            } else if (ctx.status >= 500) {
                if (options.view_500) {
                    await ctx.render(options.view_500, options.custom ? options.custom(err) : err);
                    ctx.status = previewStatus;
                }
            }
        }
    }

    const handleError = async (ctx, err) => {
        if (!ctx.status) {
            ctx.status = 404;
        }

        if (ctx.isAjaxRequest) {
            await jsonError(ctx, err);
        } else {
            await htmlError(ctx, err);
        }
    }

    const shouldEmitError = (status) => {
        return status >= 500;
    };

    return async function(ctx, next) {
        try {
            await next();

            await handleError(ctx);
        } catch (err) {
            ctx.status = err.status || err.statusCode || 500;

            await handleError(ctx, err);
            shouldEmitError(ctx.status) && ctx.app.emit('error', err, ctx);
        }
    };
};