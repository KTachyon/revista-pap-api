var ServiceFactory = function() {

	return {
		get : function(serviceName, context) {
			var Service = require('./' + serviceName);
			return new Service(context);
		}
	};

};

module.exports = new ServiceFactory(); // Singleton
