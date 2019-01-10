var jwtSimple = require('jwt-simple');

var jwt = {
	encode: function(original, jwtKey) {
		var token = jwtSimple.encode(original, jwtKey);
		return token;
	},

	decode: function(encodedContent, jwtKey) {
		var decodedContent = jwtSimple.decode(encodedContent, jwtKey);
		return decodedContent;
	}
};

module.exports = jwt;