const DefinedError = require('../customError').DefinedError;
const ErrorCodes = require('../customError').ErrorCodes;
const util = require('util');

function propertyValidator(obj, fieldArray) {
    if (!obj) {
        throw new DefinedError(ErrorCodes.INVALID_WEB_EMPTY_PARAMETER.errorCode, ErrorCodes.INVALID_WEB_EMPTY_PARAMETER.message);
    }

    if (!fieldArray || !fieldArray.length) {
        return true;
    }

    var errorField = null;
    var errFound = fieldArray.some(function(item) {
        if (!item) {
            return false;
        }

        var value = null;
        if (typeof item == 'string') {
            value = obj[item];
        } else if (item instanceof Array) {
            value = item.find(function(name) {
                if (name in obj) {
                    return true;
                } else {
                    return false;
                }
            });
        }

        if (value == undefined) {
            errorField = item;

            return true;
        } else if (typeof(value) === 'string' && !value) {
            errorField = item;

            return true;
        } else {
            return false;
        }
    });

    if (errFound) {
        throw new DefinedError(ErrorCodes.INVALID_WEB_EMPTY_PARAMETER.errorCode, ErrorCodes.INVALID_WEB_EMPTY_PARAMETER.message);
    } else {
        return true;
    }
}

function arrayValidator(array, fieldArray) {
    if (!array || !Array.isArray(array) || !array.length) {
        throw new DefinedError(ErrorCodes.INVALID_WEB_EMPTY_PARAMETER.errorCode, ErrorCodes.INVALID_WEB_EMPTY_PARAMETER.message);
    }

    array.forEach(element => {
        propertyValidator(element, fieldArray);
    });
}

module.exports = {
    propertyValidator: propertyValidator,
    arrayValidator: arrayValidator
};