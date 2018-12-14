// @flow
import type { WebsocketConnectionType } from 'src/reducers/connectionStatus';

type ConnectionProps = {
  networkOnline: boolean,
  websocketConnection: WebsocketConnectionType,
};

type Props = {
  prev: ConnectionProps,
  curr: ConnectionProps,
};

const validateProps = (props: Props) => {
  if (!props.prev || !props.curr) return false;
  if (
    !props.prev.hasOwnProperty('networkOnline') ||
    !props.curr.hasOwnProperty('networkOnline')
  ) {
    return false;
  }

  if (
    !props.prev.hasOwnProperty('websocketConnection') ||
    !props.curr.hasOwnProperty('websocketConnection')
  ) {
    return false;
  }

  return true;
};

const websocketDidReconnect = (props: Props) => {
  const { curr, prev } = props;
  if (
    prev.websocketConnection === 'reconnecting' &&
    curr.websocketConnection === 'reconnected'
  )
    return true;
  return false;
};

const networkOnlineDidReconnect = (props: Props) => {
  const { curr, prev } = props;
  if (prev.networkOnline === false && curr.networkOnline === true) return true;
  return false;
};

export const useConnectionRestored = (props: Props) => {
  if (!validateProps(props)) return false;
  if (websocketDidReconnect(props)) return false;
  if (networkOnlineDidReconnect(props)) return false;
  return false;
};
