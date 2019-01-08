function isArray(value) {
    return Array.isArray(value);
}

function isString(value){
	return Object.prototype.toString.call(params) === '[object String]';
}

module.exports = {
	isArray,
	isString
}