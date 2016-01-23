var rekuire = require('rekuire');
var db = rekuire('configuration/db');
var Sequelize = require('sequelize');

var Edition = db.define('Edition', {
	id : {
		type : Sequelize.UUID,
		primaryKey : true,
		defaultValue : Sequelize.UUIDV4
	},
    number : {
        type : Sequelize.INTEGER,
        unique : true,
        allowNull : false
    },
    covers : {
        type : Sequelize.JSON
    },
    pdf : {
        type : Sequelize.STRING,
        validate : {
            isUrl : true
        }
    }
});

module.exports = Edition;
