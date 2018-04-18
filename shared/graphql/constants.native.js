// @flow
// The constants for the GraphQL client on ReactNative

export const IS_PROD = process.env.NODE_ENV === 'production';
// In production the API is at the same URL, in development it's at a different port
export const API_URI = IS_PROD
  ? 'https://spectrum.chat/api'
  : 'http://localhost:3001/api';
export const WS_URI = IS_PROD
  ? `wss://spectrum.chat/websocket`
  : 'ws://localhost:3001/websocket';
