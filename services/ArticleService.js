var rekuire = require('rekuire');
var db = rekuire('configuration/db');

var Article = db.models.Article;
var Edition = db.models.Edition;
var Category = db.models.Category;

var ArticleService = function(context) {
    var getTransaction = context.getTransaction;

    return {
        getAll: function() {
            var query = { include : [ Edition, Category ] };

            if (context.edition) {
                query.where = { EditionId : context.edition.get('id') };
            }

            return Article.findAll(query);
        },

        get: function(uuid) {
            var query = { where : { id : uuid }, include : [ Edition, Category ] };
            
            if (context.edition) {
                query.where.EditionId = context.edition.get('id');
            }

            return Article.find(query).then(function(article) {
                if (!article) {
                    var noSuchArticleError = new Error('Article not found');
                    noSuchArticleError.statusCode = 404;
                    throw noSuchArticleError;
                }

                return article;
            });
        }
    };
};

module.exports = ArticleService;
