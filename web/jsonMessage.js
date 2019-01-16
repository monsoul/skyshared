
function JsonMessage() {

}

JsonMessage.success = function (data, ctx) {
    return {
		head: {
			code: '000000',
			message: 'ok',
			serialId: ctx.serialId,
			sessionId: ctx.sessionId,
			timestamp: ctx.requestTime
		},
		body: data
    };
}

JsonMessage.error = function (err, ctx) {
    return {
		head: {
			code: err.errorCode,
			message: err.message,
			serialId: ctx.serialId,
			sessionId: ctx.sessionId,
			timestamp: ctx.requestTime
		},
		body: err.data
    };
}

module.exports = JsonMessage;