/**
 * @flow
 */

import Expo from 'expo';

// @todo implement navigation (either JS or native)
import App from './views/splash';

/**
 * By default, Expo will look for an `App.js` file with an entry point and
 * register component that is exported by default as a root. Here, we use
 * `index.js` to keep it similar with `web`. That makes it neccessary to
 * register the root component manually.
 */
Expo.registerRootComponent(App);
