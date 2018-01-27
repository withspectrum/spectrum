const Path = require('path');

module.exports = {
  getProjectRoots: () => [__dirname, Path.join(__dirname, '..')],
};
