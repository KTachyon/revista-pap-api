var rekuire = require('rekuire');
var Promise = require('bluebird');
var harPromise = rekuire('utils/HARRequestPromise');
var xml2js = require('xml2js');
var _ = require('lodash');

var db = rekuire('configuration/db');

var Edition = rekuire('models/Edition');
var Article = rekuire('models/Article');
var Category = rekuire('models/Category');

return db.transaction().then(function(transaction) {

	function parseXMLPromise(xml) {
		var parser = new xml2js.Parser();

		return new Promise(function(fulfill, reject) {
			parser.parseString(xml, function(err, result) {
				if (err) { return reject(err); }

				fulfill(result);
			});
		});
	}

	function insertEdition(number, covers, pdf) {
		var edition = Edition.build({
			number : number,
			covers : covers,
			pdf : pdf
		}, { isNewRecord: true });

		return edition.save({ transaction : transaction });
	}

	function insertCategory(name) {
		return Category.build({ name : name }, { isNewRecord: true }).save({ transaction : transaction });
	}

	function insertArticle(edition, category, title, summary) {
		var article = Article.build({
			title : title,
			summary : summary || 'N/D',
			CategoryId : category.get('id'),
			EditionId : edition.get('id')
		}, { isNewRecord: true });

		return article.save({ transaction : transaction });
	}

	var har = {
		method : 'GET',
		url : 'http://programar.sergioribeiro.com/programar.xml'
	};

	function editionInsertionProcedure(xmlEdition) {
		var xmlCoversArray = xmlEdition.imagens.capas;

		var covers = {};

		if (xmlCoversArray) {
			covers = _.reduce(xmlEdition.imagens.capas[0].capa, function(memo, cover) {
				memo[cover.$.tamanho] = cover._;
				return memo;
			}, {});
		}

		return insertEdition(xmlEdition.$.num, covers, xmlEdition.pdf[0]).then(function(edition) {
			var xmlCategories = xmlEdition.artigos[0].categoria;

			return _.reduce(xmlCategories, function(memo, xmlCategory) {
				return memo.then(function() {
					return categoryInsertionProcedure(xmlCategory, edition);
				});
			}, Promise.resolve(null));
		});
	}

	function categoryInsertionProcedure(xmlCategory, edition) {
		return Category.find({ where : { name : xmlCategory.$.designacao } }).then(function(category) {
			if (!category) {
				return insertCategory(xmlCategory.$.designacao);
			}

			return category;
		}).then(function(category) {
			var xmlArticles = xmlCategory.artigo;

			return _.reduce(xmlArticles, function(memo, xmlArticle) {
				return memo.then(function() {
					return insertArticle(edition, category, xmlArticle.$.titulo, xmlArticle._);
				});
			}, Promise.resolve(null));
		});
	}

	return harPromise(har).then(function(body) {
		return parseXMLPromise(body);
	}).then(function(result) {
		var xmlEditions = result.programar.edicoes[0].edicao;

		return _.reduce(xmlEditions, function(memo, xmlEdition) {
			return memo.then(function() {
				return editionInsertionProcedure(xmlEdition);
			});
		}, Promise.resolve(null));
	}).then(function() {
		console.log('Success');

		return transaction.commit();
	}).catch(function(err) {
		console.log('Failure', err);

		return transaction.rollback();
	});
});
