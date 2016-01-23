var express = require('express');
var categoryRouter = express.Router();

var rekuire = require('rekuire');
var uuidRegex = rekuire('utils/UUIDRegEx');
var ServiceFactory = rekuire('services/ServiceFactory');

var CategoryMapper = rekuire('mappers/v1/CategoryMapper');

function defaultMapper(data) { return CategoryMapper.map(data); }

// TODO: CATEGORIES IN CONTEXT?

// GET ALL CATEGORIES
categoryRouter.get('/', function(request, response) {
	var CategoryService = ServiceFactory.get('CategoryService', request.context);

	return CategoryService.getAll().then(defaultMapper).then(function(obj) { response.json(obj); });
});

// GET ONE CATEGORY BY UUID
categoryRouter.get('/:category_id' + uuidRegex, function(request, response) {
	var CategoryService = ServiceFactory.get('CategoryService', request.context);

	return CategoryService.get(request.params.category_id).then(defaultMapper).then(function(obj) { response.json(obj); });
});

module.exports = categoryRouter;
