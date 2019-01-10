const merge = require('merge');
const envs = require('../../constant').envs;
const signatureKeys = require('../../constant').signatureKeys;
const envName = require('../../env');
const securityUtility = require('../../util/securityUtil');
const jsonMessage = require('../../web/jsonMessage');
const DefinedError = require('../../customError').DefinedError;
const ErrorCodes = require('../../customError').ErrorCodes;

const SIGNATURE_TIMESTAMP_RANGE = 5 * 60;

module.exports = function signatureMiddleware(appSecrets, options) {
    const _appSecrets = appSecrets || {};
	const _options = options || { };
	const signatureTimestampRange = _options.signatureTimestampRange == undefined ? SIGNATURE_TIMESTAMP_RANGE : _options.signatureTimestampRange

    async function handleMessage(ctx, message) {
        if (ctx.isAjaxRequest != undefined && ctx.isAjaxRequest) {
            ctx.body = jsonMessage.error(new DefinedError(ErrorCodes.INVALID_SIGNATURE.errorCode, message));
        } else {
            if (ctx.render && _options.error_view) {
                await ctx.render(_options.error_view, {
                    errorCode: ErrorCodes.INVALID_SIGNATURE.errorCode,
                    message: message
                });
            } else {
                ctx.body = message;
            }
        }
    }

    function getParameters(requestParams) {
        let data = {};
        for (let key in requestParams) {
            if (key !== signatureKeys.signature) {
                data[key] = requestParams[key];
            }
        }
        return data;
    }

    function getSecret(appId) {
        return _appSecrets[appId];
    }

    function getSignature(ctx, requestParams) {
        let signature = ctx.headers[signatureKeys.signature];

        if (!signature) {
            signature = requestParams[signatureKeys.signature];
        }
        return signature;
    }

    async function validSignature(ctx, secret, params, signature) {
        let validateContent = securityUtility.signQueryString(secret, params);

        if (signature != validateContent) {
            await handleMessage(ctx, 'invalid signature');
            return false;
        }

        if (envName !== envs.dev) {
            let timestamp = params[signatureKeys.appTimestamp];
            if (!timestamp) {
                await handleMessage(ctx, 'invalid app timestamp');
                return false;
            } else {
                try {
                    timestamp = (new Date(timestamp)).getTime() / 1000;
                    let now = Date.now() / 1000;
                    if (now - timestamp > signatureTimestampRange) {
                        await handleMessage(ctx, 'invalid app timestamp');
                        return false;
                    }
                } catch (e) {
                    await handleMessage(ctx, 'invalid app timestamp');
                    return false;
                }
            }
        }

        if (!params[signatureKeys.appNonce]) {
            await handleMessage(ctx, 'invalid app nonce');
            return false;
        }

        return true;
    }

    return async function(ctx, next) {
        let requestParams = merge({}, ctx.query || {}, ctx.request.body || {}, ctx.params || {});

        let params = getParameters(requestParams);
        let appId = params[signatureKeys.appId];
        if (!appId) {
            await handleMessage(ctx, 'invalid app id');
            return;
        }
        let secret = getSecret(appId);
        if (!secret) {
            await handleMessage(ctx, 'invalid app id');
            return;
        }

        let signature = getSignature(ctx, requestParams);
        if (!signature) {
            await handleMessage(ctx, 'invalid signature');
            return;
        }
        if (!await validSignature(ctx, secret, params, signature)) {
            return;
        }

        ctx.appContext = ctx.appContext || {
            appId: appId
        };

        await next();
    };
};