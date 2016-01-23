var Sequelize = require('sequelize');
var _ = require('lodash');
var rekuire = require('rekuire');

var EditionMapper = rekuire('mappers/v1/EditionMapper');
var CategoryMapper = rekuire('mappers/v1/CategoryMapper');

module.exports = (function() {

    return {
        map: function(articleData) {
            return (articleData instanceof Array) ? this.mapList(articleData) : this.mapSingle(articleData);
        },

        mapList: function(articles) {
            return _.map(articles, function(article) { return this.mapSingle(article); }.bind(this));
        },

        mapSingle: function(article) {
            return {
                id : article.get('id'),
                title : article.get('title'),
                summary : article.get('summary'),
                edition : EditionMapper.map(article.Edition),
                category : CategoryMapper.map(article.Category)
            };
        }
    };

})();