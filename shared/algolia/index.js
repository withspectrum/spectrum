require('now-env');
var IS_PROD = process.env.NODE_ENV === 'production';
var ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
var ALGOLIA_API_SECRET = process.env.ALGOLIA_API_SECRET;
var algoliasearch = require('algoliasearch');
var algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_SECRET);
var initIndex = function(index) {
  return algolia.initIndex(IS_PROD ? index : index);
};
module.exports = initIndex;
