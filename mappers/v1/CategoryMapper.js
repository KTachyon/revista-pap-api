var Sequelize = require('sequelize');
var _ = require('lodash');

module.exports = (function() {

    return {
        map: function(categoryData) {
            return (categoryData instanceof Array) ? this.mapList(categoryData) : this.mapSingle(categoryData);
        },

        mapList: function(categories) {
            return _.map(categories, function(category) { return this.mapSingle(category); }.bind(this));
        },

        mapSingle: function(category) {
            return {
                id : category.get('id'),
                name : category.get('name')
            };
        }
    };

})();