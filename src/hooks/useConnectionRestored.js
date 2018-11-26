// @flow
import type {
  PageVisibilityType,
  WebsocketConnectionType,
} from 'src/reducers/connectionStatus';

type ConnectionProps = {
  networkOnline: boolean,
  websocketConnection: WebsocketConnectionType,
  pageVisibility: PageVisibilityType,
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

  if (
    !props.prev.hasOwnProperty('pageVisibility') ||
    !props.curr.hasOwnProperty('pageVisibility')
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

const pageBecameVisible = (props: Props) => {
  const { curr, prev } = props;
  if (prev.pageVisibility === 'hidden' && curr.pageVisibility === 'visible')
    return true;
  return false;
};

export const useConnectionRestored = (props: Props) => {
  if (!validateProps(props)) return false;
  if (websocketDidReconnect(props)) return true;
  if (networkOnlineDidReconnect(props)) return true;
  if (pageBecameVisible(props)) return true;
  return false;
};
