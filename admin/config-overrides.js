const rewireGqlTag = require('react-app-rewire-graphql-tag');

module.exports = function override(config, env) {
  conf = rewireGqlTag(config, env);
  return conf;
};
