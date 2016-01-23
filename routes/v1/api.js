var express = require('express');
var router = express.Router();
var rekuire = require('rekuire');
var logger = rekuire('utils/LoggerProvider').getLogger();

var Sequelize = require('sequelize');
var _ = require('lodash');

var configuration = rekuire('configuration/configuration');

var db = rekuire('configuration/db');

// Cross domain middleware, to support cross domain requests (if the API is in a different domain)
router.use(function(request, response, next) { // TODO: We can break every browser based API use by setting the allowed hosts here
	var crossdomainHeaders = {
		'Access-Control-Allow-Origin' : configuration.getCrossdomainAllowOrigin(request),
		'Access-Control-Allow-Credentials' : true,
	    'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept, JITT-SESSION-TOKEN',
	    'Access-Control-Allow-Methods' : 'GET, OPTIONS, PUT, POST, DELETE',
	    'Access-Control-Max-Age': 86400
	};

	if (request.method === 'OPTIONS') { response.end(); } else { next(); }
});

// all requests to this router will first hit this middleware
// this will create a base transaction that all database queries must run on
// if something bad happens, we just need to throw an error and rollback the transaction
// so that the database is kept coherent
router.use(function(request, response, next) {
	// create request domain context
	request.context = {};

	// TODO: Check transaction isolation levels
	/*db.transaction().then(function(transaction) {
		request.context.getTransaction = function() {
			if (transaction.connection.uuid === transaction.id) {
				return transaction;
			}

			throw new Error('No transaction available');
		};

		request.context.commit = function(callback) {
			transaction.commit().then(callback).catch(function(err) {
				// Some conflict happened, commit has failed, should have rolled back
				logger.error("COMMIT FAILED. Reason:", { route : request.path, error : err, stack : err.stack });
				response.status(500).end();
			});
		};

		request.context.rollback = function(callback) {
			transaction.rollback().then(callback).catch(function(err) {
				// CRITICAL ERROR!!! A ROLLBACK CAN'T FAIL!!!
				logger.error("CRITICAL!!! ROLLBACK FAILED. Reason:", { route : request.path, error : err, stack : err.stack });
				response.status(500).end();
			});
		};

		next();
	}).catch(function(err) {
		logger.error("Transaction creation failed!", { route : request.path, error : err, stack : err.stack });
		response.status(500).end();
	});*/

	// TODO: Not using transaction just yet ;)
	next();
});

// Configure specific routes
router.use('/editions', require('./editions'));
router.use('/articles', require('./articles'));
router.use('/categories', require('./categories'));

router.use(function(request, response) {
	logger.error("Route was not handled: " + request.originalUrl);

	request.context.rollback(function() { response.status(404).end(); });
});

module.exports = router;
