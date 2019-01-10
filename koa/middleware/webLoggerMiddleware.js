'use strict'

const Counter = require('passthrough-counter');
const bytes = require('bytes');
const util = require('util');

const logger = require('../../log').get('web');

const DEFAULT_FORMAT = '%s - -' +
    ' "%s %s HTTP/1.1"' +
    ' %s %s "%s"' +
    ' "%s"' +
    ' -body- %s' +
    ' -params- %s' +
    ' -cookie- %s';

async function webLogger(ctx, next) {
    // request
    try {
        await next()
    } catch (err) {
        // log uncaught downstream errors
        log(ctx, null, err)
        throw err
    }

    // calculate the length of a streaming response
    // by intercepting the stream with a counter.
    // only necessary if a content-length header is currently not set.
    const length = ctx.response.length;
    const body = ctx.body;
    let counter;
    if (length == null && body && body.readable) {
        ctx.body = body
            .pipe(counter = Counter())
            .on('error', ctx.onerror)
    }

    // log when the response is finished or closed,
    // whichever happens first.
    const res = ctx.res

    const onfinish = done.bind(null, 'finish')
    const onclose = done.bind(null, 'close')

    res.once('finish', onfinish)
    res.once('close', onclose)

    function done(event) {
        res.removeListener('finish', onfinish)
        res.removeListener('close', onclose)
        log(ctx, counter ? counter.length : length, null)
    }
}

function log(ctx, len, err) {
    // get the status code of the response
    const status = err ?
        (err.isBoom ? err.output.statusCode : err.status || 500) :
        (ctx.status || 404)


    // get the human readable response length
    let length
    if (~[204, 205, 304].indexOf(status)) {
        length = ''
    } else if (len == null) {
        length = '-'
    } else {
        length = bytes(len).toLowerCase()
    }

    var methodName = "error"
    if (status === 200) {
        methodName = "info";
    } else if (status >= 300) {
        methodName = "warn";
    } else if (status >= 400) {
        methodName = "error";
    }

    let body = null,
        params = null,
        cookie = null;

    if (ctx.request) {
        body = _parseJson(ctx.request.body);
    }
    if (ctx.params) {
        params = _parseJson(ctx.params);
    }
    if (ctx.headers) {
        cookie = ctx.headers.cookie;
    }

    logger[methodName](
        util.format(DEFAULT_FORMAT, ctx.ip, ctx.method, ctx.originalUrl, status,
            length, ctx.headers.referrer, ctx.headers["user-agent"],
            body, params, cookie)
    );
}

function _parseJson(objectInfo) {
    if (Object.prototype.toString.call(objectInfo) == "[object Object]") {
        try {
            return JSON.stringify(objectInfo);
        } catch (e) {}
    }

    return objectInfo;
}

module.exports = function() {
    return webLogger;
};