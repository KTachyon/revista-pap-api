var express = require('express');
var editionRouter = express.Router();

var rekuire = require('rekuire');
var uuidRegex = rekuire('utils/UUIDRegEx');
var ServiceFactory = rekuire('services/ServiceFactory');

var EditionMapper = rekuire('mappers/v1/EditionMapper');

function defaultMapper(data) { return EditionMapper.map(data); }

// GET ALL EDITIONS
editionRouter.get('/', function(request, response) {
	var EditionService = ServiceFactory.get('EditionService', request.context);

	return EditionService.getAll().then(defaultMapper).then(function(obj) { response.json(obj); });
});

function editionCall(method, request, next) {
	var EditionService = ServiceFactory.get('EditionService', request.context);

	EditionService[method](request.params.edition_id).then(function(edition) {
		request.context.edition = edition;
		next();
	});
}

editionRouter.use('/last', function(request, response, next) { editionCall('last', request, next); });
editionRouter.use('/:edition_id' + uuidRegex, function(request, response, next) { editionCall('getByUUID', request, next); });
editionRouter.use('/:edition_id([0-9]+)', function(request, response, next) { editionCall('getByNumber', request, next); });

editionRouter.use('/last/articles', require('./articles'));
editionRouter.use('/:edition_id' + uuidRegex + '/articles', require('./articles'));
editionRouter.use('/:edition_id([0-9]+)/articles', require('./articles'));

function mapFromContextAndRespond(request, response) { return response.json( defaultMapper(request.context.edition) ); }

editionRouter.get('/last', mapFromContextAndRespond);
editionRouter.get('/:edition_id' + uuidRegex, mapFromContextAndRespond);
editionRouter.get('/:edition_id([0-9]+)', mapFromContextAndRespond);

module.exports = editionRouter;
