// @flow

type InitialState = {
  networkOnline: boolean,
  websocketConnection:
    | 'connected'
    | 'connecting'
    | 'reconnected'
    | 'reconnecting',
};

const initialState: InitialState = {
  networkOnline: true,
  websocketConnection: 'connected',
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
    default:
      return state;
  }
}
