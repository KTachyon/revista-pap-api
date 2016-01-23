var express = require('express');
var articleRouter = express.Router({ mergeParams: true });

var rekuire = require('rekuire');
var uuidRegex = rekuire('utils/UUIDRegEx');
var ServiceFactory = rekuire('services/ServiceFactory');

var ArticleMapper = rekuire('mappers/v1/ArticleMapper');

function defaultMapper(data) { return ArticleMapper.map(data); }

// GET ALL ARTICLES IN CONTEXT
articleRouter.get('/', function(request, response) {
	var ArticleService = ServiceFactory.get('ArticleService', request.context);

	return ArticleService.getAll().then(defaultMapper).then(function(obj) { response.json(obj); });
});

// GET ONE ARTICLE BY IN CONTEXT
articleRouter.get('/:article_id' + uuidRegex, function(request, response) {
	var ArticleService = ServiceFactory.get('ArticleService', request.context);

	return ArticleService.get(request.params.article_id).then(defaultMapper).then(function(obj) { response.json(obj); });
});

module.exports = articleRouter;
