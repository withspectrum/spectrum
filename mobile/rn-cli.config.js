const Path = require('path');

module.exports = {
  getProjectRoot: () => Path.join(__dirname, '..'),
  getWatchFolders: () => [__dirname, Path.join(__dirname, '..')],
};
