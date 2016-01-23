var fs = require('fs');
var Promise = require('bluebird');

module.exports = function(dirPath) {
	return new Promise(function(fulfill, reject) {
		fs.readdir(dirPath, function(err, files) {
			if (err) { return reject(err); }

			fulfill(files);
		});
	});
};