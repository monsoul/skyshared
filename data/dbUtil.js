const Op = require('sequelize').Op;
const DefinedError = require('../customError').DefinedError;
const ErrorCodes = require('../customError').ErrorCodes;
const typeUtil = require('../util/typeUtil');
const operators = require('./constant').operators;


const OPERATOR_MAP = {};
OPERATOR_MAP[operators.eq] = Op.eq;
OPERATOR_MAP[operators.gt] = Op.gt;
OPERATOR_MAP[operators.ge] = Op.gte;
OPERATOR_MAP[operators.lt] = Op.lt;
OPERATOR_MAP[operators.le] = Op.lte;
OPERATOR_MAP[operators.like] = Op.like;
OPERATOR_MAP[operators.in] = Op.in;
OPERATOR_MAP[operators.between] = Op.between;

/* 
criteria: {
	column_name,
	column_name: {
		op: operators.??,
		value
	}
}
*/
function buildWhere(schema, criteria) {
    if (!criteria) {
        return;
    }

    if (!schema || !schema.columns) {
        throw new DefinedError(ErrorCodes.INVALID_DB_SCHEMA.errorCode, ErrorCodes.INVALID_DB_SCHEMA.message);
    }

    let result = {};
    let hasValue = false;
    for (let key in criteria) {
        const column = schema.columns[key];
        if (!column) {
            continue;
        }

        const columnValue = criteria[key];
        if (columnValue == undefined || columnValue === null) {
            continue;
        }

        if (columnValue.op) {
            const op = OPERATOR_MAP[columnValue.op];
            if (op) {
                hasValue = true;
                result[column.name] = {
                    [op]: columnValue.value
                }
            }
        } else {
            hasValue = true;
            if (typeUtil.isArray(columnValue)) {
                result[column.name] = {
                    [Op.in]: columnValue
                }
            } else {
                result[column.name] = columnValue;
            }
        }
    }

    if (hasValue) {
        return result;
    }
}

/*
orderFields: [{
	column,
	isDesc: true/false
}] 
*/
function buildOrder(schema, orderFields) {
    if (!orderFields || !typeUtil.isArray(orderFields) || orderFields.length === 0) {
        return;
    }

    if (!schema || !schema.columns) {
        throw new DefinedError(ErrorCodes.INVALID_DB_SCHEMA.errorCode, ErrorCodes.INVALID_DB_SCHEMA.message);
    }

    const result = [];
    orderFields.forEach(field => {
        if (typeUtil.isString(field)) {
            result.push([field]);
            return;
        }

        if (!field.column || !schema.columns[field.column]) {
            return;
        }

        const info = [];
        info.push(field.column);

        if (field.isDesc) {
            info.push('desc');
        }

        result.push(info);
    });

    return result;
}

function buildAdd(schema, criteria) {
    if (!criteria) {
        return;
    }

    if (!schema || !schema.columns) {
        throw new DefinedError(ErrorCodes.INVALID_DB_SCHEMA.errorCode, ErrorCodes.INVALID_DB_SCHEMA.message);
    }

    let hasValue = false;
    const data = {};
    for (let key in criteria) {
        const column = schema.columns[key];
        if (!column) {
            continue;
        }

        hasValue = true;
        data[column.name] = criteria[key];
    }

    if (hasValue) {
        return data;
    }
}

function buildUpdate(schema, criteria, byPrimaryKey) {
    if (!criteria) {
        return;
    }

    if (!schema || !schema.columns) {
        throw new DefinedError(ErrorCodes.INVALID_DB_SCHEMA.errorCode, ErrorCodes.INVALID_DB_SCHEMA.message);
    }

    let hasValue = false;
    let hasWhere = false;
    const data = {};
    const where = {};
    for (let key in criteria) {
        const column = schema.columns[key];
        if (!column) {
            continue;
        }

        if (column.isPrimary) {
            if (!byPrimaryKey) {
                continue;
            }

            hasWhere = true;
            where[column.name] = criteria[key];
        } else {
            hasValue = true;
            data[column.name] = criteria[key];
        }
    }

    if (hasValue) {
        if (byPrimaryKey) {
            if (!hasWhere) {
                throw new DefinedError(ErrorCodes.NO_PRIMARY_KEY.errorCode, ErrorCodes.NO_PRIMARY_KEY.message);
            }

            return {
                data,
                where
            };
        } else {
            return data;
        }
    }
}

module.exports = {
    buildWhere,
    buildOrder,
    buildAdd,
    buildUpdate
}