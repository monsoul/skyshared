const uuidGener = require('node-uuid');

function time_uuid(){
	return uuidGener.v1();
}

function uuid(){
	return uuidGener.v4();
}

function equal(p1, p2){
	p1 = p1 || '';
	p1 = (p1 + '').toLowerCase();

	p2 = p2 || '';
	p2 = (p2 + '').toLowerCase()
	
	return p1 === p2;
}

module.exports = {
	time_uuid,
	uuid,
	equal
}