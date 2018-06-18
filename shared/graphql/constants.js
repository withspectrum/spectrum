// @flow
// The constants for the GraphQL client on the web

export const IS_PROD = process.env.NODE_ENV === 'production';
// In production the API is at the same URL, in development it's at a different port
export const API_URI = IS_PROD ? '/api' : 'http://localhost:3001/api';
// If the production build is running locally connect to the websocket at localhost:3001
// else connect at thisurl.whatever/websocket
export const WS_URI =
  IS_PROD && window.location.host !== 'localhost:3006'
    ? `wss://${window.location.host}/websocket`
    : 'ws://localhost:3001/websocket';
