const BASE_CODE = 700000;
const DB_CODE = 100;
const BASE_BIZ_CODE = 200;

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
            errorCode: BASE_CODE + DB_CODE + 1,
            message: 'invalid db settings'
        },
        DB_NOT_EXISTS: {
            errorCode: BASE_CODE + DB_CODE + 2,
            message: 'db not exist'
		},
		INVALID_DB_SCHEMA: {
			errorCode: BASE_CODE + DB_CODE + 3,
			message: 'invalid db schema'
		},
		NO_PRIMARY_KEY: {
			errorCode: BASE_CODE + DB_CODE + 4,
			message: 'no primary key'
		},
		

        INVALID_WEB_EMPTY_PARAMETER: {
            errorCode: BASE_CODE + BASE_BIZ_CODE + 1,
            message: 'have no a parameter'
		},
		CACHE_INIT_ERROR: {
			errorCode: BASE_CODE + BASE_BIZ_CODE + 2,
			message: 'failed to init cache'
		},
		REMOTE_SERVICE_ERROR: {
			errorCode: BASE_CODE + BASE_BIZ_CODE + 3,
			message: 'remote server error'
		},
		INVALID_SIGNATURE: {
			errorCode: BASE_CODE + BASE_BIZ_CODE + 4,
			message: 'invalid signature'
		},


		SERVER_ERROR: {
			errorCode: BASE_CODE + 9999,
			message: 'server error'
		}
    }
}