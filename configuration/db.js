var Sequelize = require('sequelize');
var configuration = require('./configuration');
var rekuire = require('rekuire');
var logger = rekuire('utils/LoggerProvider').getLogger();

var db = new Sequelize(configuration.getDatabaseName(), configuration.getDatabaseUsername(), configuration.getDatabasePassword(), {
	host: configuration.getDatabaseHost(),
	port : configuration.getDatabasePort(),
	dialect:  'postgres',
    protocol: 'postgres',
    native: true,
    //maxConcurrentQueries: 100, // (default: 50)
    //pool: { maxConnections: 5, maxIdleTime: 30}, // use pooling in order to reduce db connection overload and to increase speed
    logging: function(message) { logger.info(message); },
	define: {
	    underscored: false,
	    freezeTableName: false,
	    charset: 'utf8',
	    collate: 'utf8_general_ci',
	    timestamps: true
	}
});

module.exports = db;
