// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { withApollo } from 'react-apollo';
import { Link } from 'react-router-dom';
import Icon from 'src/components/icon';
import setLastSeenMutation from 'shared/graphql/mutations/directMessageThread/setDMThreadLastSeen';
import Messages from '../components/messages';
import Header from '../components/header';
import ChatInput, { cleanSuggestionUserObject } from 'src/components/chatInput';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import getDirectMessageThread, {
  type GetDirectMessageThreadType,
} from 'shared/graphql/queries/directMessageThread/getDirectMessageThread';
import { setTitlebarProps } from 'src/actions/titlebar';
import { UserAvatar } from 'src/components/avatar';
import { MessagesContainer, ViewContent } from '../style';
import { ChatInputWrapper } from 'src/components/layout';
import { Loading } from 'src/components/loading';
import { ErrorBoundary } from 'src/components/error';
import type { WebsocketConnectionType } from 'src/reducers/connectionStatus';
import { useConnectionRestored } from 'src/hooks/useConnectionRestored';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { LoadingView, ErrorView } from 'src/views/viewHelpers';
import { DesktopTitlebar } from 'src/components/titlebar';

type Props = {
  data: {
    refetch: Function,
    directMessageThread: GetDirectMessageThreadType,
  },
  isLoading: boolean,
  setLastSeen: Function,
  match: Object,
  id: ?string,
  currentUser: Object,
  threadSliderIsOpen: boolean,
  networkOnline: boolean,
  websocketConnection: WebsocketConnectionType,
  dispatch: Dispatch<Object>,
};

class ExistingThread extends React.Component<Props> {
  chatInput: ?ChatInput;

  componentDidMount() {
    const { threadId } = this.props.match.params;

    // escape to prevent this from running on mobile
    if (!threadId) return;

    this.props.setLastSeen(threadId);
    // autofocus on desktop
    if (window && window.innerWidth > 768 && this.chatInput) {
      this.chatInput.focus();
    }
  }

  componentDidUpdate(prev) {
    const curr = this.props;
    const { dispatch, currentUser } = curr;

    const didReconnect = useConnectionRestored({ curr, prev });
    if (didReconnect && curr.data.refetch) {
      curr.data.refetch();
    }

    if (curr.data.directMessageThread) {
      const thread = curr.data.directMessageThread;
      const trimmedUsers = thread.participants.filter(
        user => user.userId !== currentUser.id
      );
      const titleIcon =
        trimmedUsers.length === 1 ? (
          <UserAvatar user={trimmedUsers[0]} size={24} />
        ) : null;
      const rightAction =
        trimmedUsers.length === 1 ? (
          <Link to={`/users/${trimmedUsers[0].username}`}>
            <Icon glyph={'info'} />
          </Link>
        ) : null;
      const names = trimmedUsers.map(user => user.name).join(', ');
      dispatch(
        setTitlebarProps({
          title: names,
          titleIcon,
          rightAction,
          leftAction: 'view-back',
        })
      );
    }

    // if the thread slider is open, dont be focusing shit up in heyuhr
    if (curr.threadSliderIsOpen) return;
    // if the thread slider is closed and we're viewing DMs, refocus the chat input
    if (prev.threadSliderIsOpen && !curr.threadSliderIsOpen && this.chatInput) {
      this.chatInput.focus();
    }
    // as soon as the direct message thread is loaded, refocus the chat input
    if (
      curr.data.directMessageThread &&
      !prev.data.directMessageThread &&
      this.chatInput
    ) {
      this.chatInput.focus();
    }
    if (prev.match.params.threadId !== curr.match.params.threadId) {
      const threadId = curr.match.params.threadId;

      // prevent unnecessary behavior on mobile
      if (!threadId) return;

      curr.setLastSeen(threadId);
      // autofocus on desktop
      if (window && window.innerWidth > 768 && this.chatInput) {
        this.chatInput.focus();
      }
    }
  }

  render() {
    const id = this.props.match.params.threadId;
    const { currentUser, data, isLoading } = this.props;

    if (id !== 'new') {
      if (data.directMessageThread) {
        const thread = data.directMessageThread;
        const trimmedUsers = thread.participants.filter(
          user => user.userId !== currentUser.id
        );
        const titleIcon =
          trimmedUsers.length === 1 ? (
            <UserAvatar user={trimmedUsers[0]} size={24} />
          ) : null;
        const rightAction =
          trimmedUsers.length === 1 ? (
            <Link to={`/users/${trimmedUsers[0].username}`}>
              <Icon glyph={'info'} />
            </Link>
          ) : null;
        const names = trimmedUsers.map(user => user.name).join(', ');
        const mentionSuggestions = thread.participants
          .map(cleanSuggestionUserObject)
          .filter(user => user && user.username !== currentUser.username);
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <DesktopTitlebar
              title={names}
              titleIcon={titleIcon}
              rightAction={rightAction}
            />
            <MessagesContainer>
              <ViewContent>
                {!isLoading ? (
                  <React.Fragment>
                    <ErrorBoundary>
                      <Header thread={thread} currentUser={currentUser} />
                    </ErrorBoundary>

                    <Messages
                      id={id}
                      currentUser={currentUser}
                      thread={thread}
                    />
                  </React.Fragment>
                ) : (
                  <Loading />
                )}
              </ViewContent>

              <ChatInputWrapper>
                <ChatInput
                  threadId={id}
                  currentUser={currentUser}
                  threadType={'directMessageThread'}
                  onRef={chatInput => (this.chatInput = chatInput)}
                  participants={mentionSuggestions}
                />
              </ChatInputWrapper>
            </MessagesContainer>
          </div>
        );
      }

      if (isLoading) {
        return <LoadingView />;
      }

      return <ErrorView />;
    }

    /*
      if we are viewing /new we will handle the messages view in the composer
      component
    */
    return null;
  }
}

const map = state => ({
  networkOnline: state.connectionStatus.networkOnline,
  websocketConnection: state.connectionStatus.websocketConnection,
  threadSliderIsOpen: state.threadSlider.isOpen,
});
export default compose(
  // $FlowIssue
  connect(map),
  getDirectMessageThread,
  setLastSeenMutation,
  withApollo,
  withCurrentUser,
  viewNetworkHandler
)(ExistingThread);
