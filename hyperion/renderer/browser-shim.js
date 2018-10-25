// @flow
// Shim some browser stuff we use in the client for server-side rendering
// NOTE(@mxstbr): We should be getting rid of this over time
global.window = {
  location: {
    protocol: 'https:',
    host: 'spectrum.chat',
    hash: '',
  },
  addEventListener: () => {},
};
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};
global.navigator = {
  userAgent: '',
};
global.CSS = {
  escape: require('css.escape'),
};
