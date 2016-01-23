var rekuire = require('rekuire');
var db = rekuire('configuration/db');
var Sequelize = require('sequelize');

var Category = require('./Category');
var Edition = require('./Edition');

var Article = db.define('Article', {
	id : {
		type : Sequelize.UUID,
		primaryKey : true,
		defaultValue : Sequelize.UUIDV4
	},
	title : {
		type : Sequelize.STRING,
		allowNull : false
	},
	summary : {
		type : Sequelize.TEXT,
		allowNull : false
	}
}, {
    classMethods: {

        getSearchVector: function() {
            return 'ArticleText';
        },

        addFullTextIndex: function() {
            var searchFields = ['title', 'summary'];
            
            var vectorName = Article.getSearchVector();
            db.query('ALTER TABLE "' + Article.tableName + '" ADD COLUMN "' + vectorName + '" TSVECTOR')
                .then(function() {
                    return db.query('UPDATE "' + Article.tableName + '" SET "' + vectorName + '" = to_tsvector(\'english\', ' + searchFields.join(' || \' \' || ') + ')')
                            .catch(console.log);
                }).then(function() {
                    return db.query('CREATE INDEX post_search_idx ON "' + Article.tableName + '" USING gin("' + vectorName + '");')
                            .catch(console.log);
                }).then(function() {
                    return db.query('CREATE TRIGGER post_vector_update BEFORE INSERT OR UPDATE ON "' + Article.tableName + '" FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger("' + vectorName + '", \'pg_catalog.english\', ' + searchFields.join(', ') + ')')
                            .catch(console.log);
                }).catch(console.log);

        },

        search: function(query) {
            query = db.getQueryInterface().escape(query);
            console.log(query);
            
            return db.query('SELECT * FROM "' + Article.tableName + '" WHERE "' + Article.getSearchVector() + '" @@ plainto_tsquery(\'english\', ' + query + ')', { type : db.QueryTypes.SELECT, model : Article });
        }
    }
});

Article.belongsTo(Category, {
    foreignKey : { allowNull : false }
});

Edition.hasMany(Article, {
    foreignKey : { allowNull : false }
});

Article.belongsTo(Edition, {
    foreignKey : { allowNull : false }
});

module.exports = Article;
