var Sequelize = require('sequelize');
var _ = require('lodash');

module.exports = (function() {

    return {
        map: function(editionData) {
            return (editionData instanceof Array) ? this.mapList(editionData) : this.mapSingle(editionData);
        },

        mapList: function(editions) {
            return _.map(editions, function(edition) { return this.mapSingle(edition); }.bind(this));
        },

        mapSingle: function(edition) {
            return {
                id : edition.get('id'),
                number : edition.get('number'),
                covers : edition.get('covers'),
                pdf : edition.get('pdf')
            };
        }
    };

})();