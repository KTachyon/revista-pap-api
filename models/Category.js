var rekuire = require('rekuire');
var db = rekuire('configuration/db');
var Sequelize = require('sequelize');

var Category = db.define('Category', {
	id : {
		type : Sequelize.UUID,
		primaryKey : true,
		defaultValue : Sequelize.UUIDV4
	},
	name : {
		type : Sequelize.STRING,
		allowNull : false
	}
}, {
	name : {
		plural : 'Categories',
		singular : 'Category'
	}
});

module.exports = Category;
