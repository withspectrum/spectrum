/**
 * @flow
 */
const path = require('path');

/**
 * Config for `Metro` bundler
 */
module.exports = {
  /**
   * Similar to Webpack `resolve.alias`, this can be used
   * to define aliases for paths within the codebase or for
   * overwriting existing modules.
   */
  extraNodeModules: {
    /**
     * React Native is a dependency contained within `mobile` folder.
     * Requiring `styled-components/native` from parent will produce an error,
     * unless this is defined.
     *
     * Note: Can be useful for other modules as well.
     */
    'react-native': path.resolve(__dirname, 'node_modules/react-native'),
  },
  /**
   * `Metro` is set up in a way that it lets you require files that are
   * within your root (which defaults to `process.cwd()`). Since we
   * want to require files from other folders (like shared, web) and
   * from parent node_modules, it is necessary that we define these paths
   * below.
   */
  getProjectRoots() {
    return [path.resolve(__dirname), path.resolve(__dirname, '../')];
  },
};
