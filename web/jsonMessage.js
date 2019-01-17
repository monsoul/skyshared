
function JsonMessage() {

}

JsonMessage.success = function (data, ctx) {
	ctx = ctx || {};

	if(ctx.headResult){
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
	else{
		return {
			isSuccess: true,
			result: data,
			now: Math.floor((new Date()).getTime() / 1000)
		};
	}
}

JsonMessage.error = function (err, ctx) {
	ctx = ctx || {};

	if(ctx.headResult){
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
	else{
		return {
			isSuccess: false,
			errorCode: err.errorCode,
			message: err.message,
			result: err.data,
			now: Math.floor((new Date()).getTime() / 1000)
		};
	}
}

module.exports = JsonMessage;