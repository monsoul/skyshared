
function JsonMessage() {

}

JsonMessage.success = function (data) {
    return {
        isSuccess: true,
        result: data,
        now: Math.floor((new Date()).getTime() / 1000)
    };
}

JsonMessage.error = function (err) {
    return {
        isSuccess: false,
        errorCode: err.errorCode,
        message: err.message,
        result: err.data,
        now: Math.floor((new Date()).getTime() / 1000)
    };
}

module.exports = JsonMessage;