export type WebsocketConnectionType =
  | 'connected'
  | 'connecting'
  | 'reconnected'
  | 'reconnecting';

export type PageVisibilityType = 'visible' | 'hidden';

type InitialState = {
  networkOnline: boolean,
  websocketConnection: WebsocketConnectionType,
  pageVisibility: PageVisibilityType,
};

const initialState: InitialState = {
  networkOnline: true,
  websocketConnection: 'connected',
  pageVisibility: 'visible',
};

export default function status(state = initialState, action) {
  switch (action.type) {
    case 'NETWORK_CONNECTION':
      return Object.assign({}, state, {
        networkOnline: action.value,
      });
    case 'WEBSOCKET_CONNECTION':
      return Object.assign({}, state, {
        websocketConnection: action.value,
      });
    case 'PAGE_VISIBILITY':
      return Object.assign({}, state, {
        pageVisibility: action.value,
      });
    default:
      return state;
  }
}
