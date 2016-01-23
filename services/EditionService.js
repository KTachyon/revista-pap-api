var rekuire = require('rekuire');
var db = rekuire('configuration/db');
var Edition = db.models.Edition;

var EditionService = function(context) {
    var getTransaction = context.getTransaction;

    return {
        getAll: function() {
            return Edition.findAll();
        },

        getByUUID: function(uuid) {
            return Edition.find({ where : { id : uuid } }).then(function(edition) {
                if (!edition) {
                    var noSuchEditionError = new Error('Edition not found');
                    noSuchEditionError.statusCode = 404;
                    throw noSuchEditionError;
                }

                return edition;
            });
        },

        getByNumber: function(number) {
            return Edition.find({ where : { number : number } }).then(function(edition) {
                if (!edition) {
                    var noSuchEditionError = new Error('Edition not found');
                    noSuchEditionError.statusCode = 404;
                    throw noSuchEditionError;
                }

                return edition;
            });
        },

        last: function() {
            return Edition.findOne({ order: [ ['number', 'DESC'] ] });
        }
    };
};

module.exports = EditionService;
