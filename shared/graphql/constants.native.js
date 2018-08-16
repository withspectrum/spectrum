// @flow
// The constants for the GraphQL client on ReactNative
// NOTE(@mxstbr): ReactNative won't let me import from 'expo' here, so
// I have to manually resolve the mobile node_modules, which Flow doesn't like
// $FlowIssue
import Constants from '../../mobile/node_modules/expo/src/Constants';

export const IS_PROD = process.env.NODE_ENV === 'production';
// TODO(@mxstbr): Make this BASE_URI be based on the computer's IP address
// so you can query your local API from a device
export const DEV_BASE_URI = !IS_PROD
  ? Constants.manifest.debuggerHost.replace(/:\d+/, ':3001')
  : 'localhost:3001';

// In production the API is at the same URL, in development it's at a different port
export const API_URI = IS_PROD
  ? 'https://spectrum.chat/api'
  : `http://${DEV_BASE_URI}/api`;
export const WS_URI = IS_PROD
  ? `wss://spectrum.chat/websocket`
  : `ws://${DEV_BASE_URI}/websocket`;
