var rekuire = require('rekuire');
var db = rekuire('configuration/db');
var Category = db.models.Category;

var CategoryService = function(context) {
    var getTransaction = context.getTransaction;

    return {
        getAll: function() {
            return Category.findAll();
        },

        get: function(uuid) {
            return Category.find({ where : { id : uuid } }).then(function(category) {
                if (!category) {
                    var noSuchCategoryError = new Error('Category not found');
                    noSuchCategoryError.statusCode = 404;
                    throw noSuchCategoryError;
                }

                return category;
            });
        }
    };
};

module.exports = CategoryService;
