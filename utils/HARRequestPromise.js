var Promise = require('bluebird');
var request = require('request');

module.exports = function(har) {

    return new Promise(function(fulfill, reject) {

        request({ har: har }, function(error, response, body) {
            if (error) { return reject(error); }

            fulfill([ body, response ]);
        });

    }).spread(function(body, response) {
        if (response.statusCode > 399) {
    		var error = new Error(response.statusCode);
            throw error;
    	}

    	return body;
    });

};