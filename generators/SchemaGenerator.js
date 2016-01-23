var rekuire = require('rekuire');
var db = rekuire('configuration/db');
var path = require('path');

var Promise = require('bluebird');
var _ = require('lodash');

var readDirPromise = rekuire('utils/ReadDirPromise');

var schemaExistsQuery = function(schemaName) {
    return "SELECT schema_name FROM information_schema.schemata WHERE schema_name = '" + schemaName + "';";
};

var createSchemaIfNotExists = function(schemaName) {
    return db.query(schemaExistsQuery(schemaName)).then(function(schemas) {
        if (schemas[0].length === 0) {
            return db.createSchema(schemaName);
        }

        console.log("Schema exists, skipping...");
    });
};

// Load all models before generating
var normalizedPath = path.join(__dirname, "../models/");

return readDirPromise(normalizedPath).then(function(models) {
    return Promise.all(
        _.map(models, function(model) {
            require( path.join(normalizedPath, model) );
        })
    );
}).then(function() {
    return createSchemaIfNotExists('public');
}).then(function() {
    return db.sync();
}).then(function() {
    return db.models.Article.addFullTextIndex();
}).then(function() {
	console.log('Database generation successful!');
}).catch(function(error) {
	console.log('Failed!');
	console.log('Reason:', error, error.stack);
});
