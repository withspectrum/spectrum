// @flow
export type WebsocketConnectionType =
  | 'connected'
  | 'connecting'
  | 'reconnected'
  | 'reconnecting';

type InitialState = {
  networkOnline: boolean,
  websocketConnection: WebsocketConnectionType,
};

type ActionType = {
  type: 'NETWORK_CONNECTION' | 'WEBSOCKET_CONNECTION' | 'PAGE_VISIBILITY',
  value: any,
};

const initialState: InitialState = {
  networkOnline: true,
  websocketConnection: 'connected',
};

export default function status(
  state: InitialState = initialState,
  action: ActionType
) {
  switch (action.type) {
    case 'NETWORK_CONNECTION':
      return Object.assign({}, state, {
        networkOnline: action.value,
      });
    case 'WEBSOCKET_CONNECTION':
      return Object.assign({}, state, {
        websocketConnection: action.value,
      });
    default:
      return state;
  }
}
