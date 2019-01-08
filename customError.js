const BASE_CODE = 1000;

class DefinedError extends Error {
    constructor(errorCode, message) {
        super(message);

        this.errorCode = errorCode;
    }
}

module.exports = {
    DefinedError,
    ErrorCodes: {
        DB_INIT_ERROR: {
            errorCode: BASE_CODE + 1,
            message: 'db init error'
        },
        INVALID_DB_SETTINGS: {
            errorCode: BASE_CODE + 2,
            message: 'invalid db settings'
        },
        DB_NOT_EXISTS: {
            errorCode: BASE_CODE + 3,
            message: 'db not exist'
        },
        INVALID_WEB_EMPTY_PARAMETER: {
            errorCode: BASE_CODE + 4,
            message: 'have no a parameter'
		},
		CACHE_INIT_ERROR: {
			errorCode: BASE_CODE + 5,
			message: 'failed to init cache'
		}
    }
}