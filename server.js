var rekuire = require('rekuire');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var morgan = require('morgan');
var intel = require('intel');
var Promise = require('bluebird');
var _ = require('lodash');
var fs = require('fs');

var configuration = rekuire('configuration/configuration');

intel.basicConfig({
    format: '[%(date)s] %(name)s:: %(message)s',
    level : configuration.getLogLevel()
});

var logger = rekuire('utils/LoggerProvider').getLogger();
var readDirPromise = rekuire('utils/ReadDirPromise');

// Load all models before starting the server
var normalizedPath = path.join(__dirname, "models/");

readDirPromise(normalizedPath).then(function(models) {
	return Promise.all(
        _.map(models, function(model) {
            require( path.join(normalizedPath, model) );
        })
    );
}).then(function() {
	// Prepare server
	var app = express();

	app.use(bodyParser.json());

	app.use(morgan('common'));

	// Setup routes (base entry point)
	app.use(configuration.getAPIBasePath() + '/v1', require('./routes/v1/api'));

	// Start listening
	app.listen(configuration.getServerPort());
	logger.info('API is running on port ' + configuration.getServerPort());

});
