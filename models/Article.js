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
