function isArray(value) {
    return Array.isArray(value);
}

function isString(value){
	return Object.prototype.toString.call(value) === '[object String]';
}

function isBool(value){
	return typeof value === 'boolean';
}

function isDate(value){
	return Object.prototype.toString.call(value) === '[object Date]';
}

function isObject(value){
	return Object.prototype.toString.call(value) === '[object Object]';
}

module.exports = {
	isArray,
	isString,
	isBool,
	isDate,
	isObject
}