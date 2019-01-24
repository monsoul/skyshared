
function toFixed(value, digits){
	digits = digits || 2;

	value = value || 0;
	if(!value.toFixed){
		value = 0;
	}

	return value.toFixed(digits);
}

module.exports = {
	toFixed
}