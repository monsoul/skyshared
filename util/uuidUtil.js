const uuidGener = require('node-uuid');

function time_uuid(){
	return uuidGener.v1();
}

function uuid(){
	return uuidGener.v4();
}

module.exports = {
	time_uuid,
	uuid
}