var intel = require('intel');

var LoggerProvider = function() {

    return {
        getLogger : function(descriptor) {
            return intel.getLogger(descriptor || 'api');
        }
    };

};

module.exports = new LoggerProvider();
