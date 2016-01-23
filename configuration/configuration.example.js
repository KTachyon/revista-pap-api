var path = require('path');
var intel = require('intel');

var crossdomainHeaders = {
	'Access-Control-Allow-Origin' : function(request) {
		return request.get('origin'); // Since we are using credentials, we can only return a single origin here! Use this to filter the allowed origins.
	},
	'Access-Control-Allow-Credentials' : true,
    'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept, JITT-SESSION-TOKEN',
    'Access-Control-Allow-Methods' : 'GET, OPTIONS, PUT, POST, DELETE',
    'Access-Control-Max-Age': 86400
};

var database = {
	host : null,
	port : null,
	name : 'revista_pap',
	username : '',
	password : ''
};

var logLevel = intel.DEBUG;
var serverPort = 3000;
var apiBasePath = '/api';

module.exports = {

	getAPIBasePath: function() {
		return apiBasePath;
	},

	getServerPort: function() {
		return serverPort;
	},

	getLogLevel: function() {
		return logLevel;
	},

	// Database credentials

	getDatabaseHost: function() {
		return database.host;
	},

	getDatabasePort: function() {
		return database.port;
	},

	getDatabaseName: function() {
		return database.name;
	},

	getDatabaseUsername: function() {
		return database.username;
	},

	getDatabasePassword: function() {
		return database.password;
	},

	// Crossdomain

	getCrossdomainAllowOrigin: function(request) {
		return request.get('origin'); // Since we are using credentials, we can only return a single origin here! Use this to filter the allowed origins.
	}

};
