// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withCurrentUser } from 'src/components/withCurrentUser';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import getThreadMessages from 'shared/graphql/queries/thread/getThreadMessageConnection';
import { useConnectionRestored } from 'src/hooks/useConnectionRestored';
import type { WebsocketConnectionType } from 'src/reducers/connectionStatus';
import ChatInput from 'src/components/chatInput';
import {
  WatercoolerWrapper,
  WatercoolerMessages,
  WatercoolerChatInput,
} from '../style';

type State = {
  subscription: ?Function,
};

class Component extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.chatInput = null;
    this.state = { subscription: null };
  }

  componentDidUpdate(prev: Props) {
    const curr = this.props;

    const didReconnect = useConnectionRestored({ curr, prev });
    if (didReconnect && curr.data.refetch) {
      curr.data.refetch();
    }
  }

  componentDidMount() {
    this.subscribe();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  subscribe = () => {
    this.setState({
      subscription: this.props.subscribeToNewMessages(),
    });
  };

  unsubscribe = () => {
    const { subscription } = this.state;
    if (subscription) {
      // This unsubscribes the subscription
      return Promise.resolve(subscription());
    }
  };

  forceScrollToBottom = () => {};

  renderDummies = () => {
    let count = 0;
    let dummies = [];
    while (count < 100) {
      dummies.push(<p>Test message</p>);
      count++;
    }
    return dummies;
  };

  render() {
    const { id, currentUser } = this.props;

    return (
      <WatercoolerWrapper>
        <WatercoolerMessages>{this.renderDummies()}</WatercoolerMessages>

        <WatercoolerChatInput>
          <ChatInput
            thread={id}
            currentUser={currentUser}
            threadType={'directMessageThread'}
            forceScrollToBottom={this.forceScrollToBottom}
            onRef={chatInput => (this.chatInput = chatInput)}
            participants={[]}
          />
        </WatercoolerChatInput>
      </WatercoolerWrapper>
    );
  }
}

const map = state => ({
  networkOnline: state.connectionStatus.networkOnline,
  websocketConnection: state.connectionStatus.websocketConnection,
});

export const WatercoolerChat = compose(
  getThreadMessages,
  withCurrentUser,
  viewNetworkHandler,
  connect(map)
)(Component);
