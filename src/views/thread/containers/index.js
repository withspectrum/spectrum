import * as React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { track } from '../../../helpers/events';
// $FlowFixMe
import generateMetaInfo from 'shared/generate-meta-info';
import { addCommunityToOnboarding } from '../../../actions/newUserOnboarding';
import Titlebar from '../../../views/titlebar';
import ThreadDetail from '../components/threadDetail';
import Messages from '../components/messages';
import Head from '../../../components/head';
import ChatInput from '../../../components/chatInput';
import ViewError from '../../../components/viewError';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { HorizontalRule } from '../../../components/globals';
import { getThread } from '../queries';
import { LoadingThreadDetail, LoadingChat } from '../../../components/loading';
import Icon from '../../../components/icons';
import {
  View,
  Content,
  Input,
  Detail,
  ChatInputWrapper,
  ChatWrapper,
} from '../style';
import { NullState, UpsellSignIn } from '../../../components/upsell';
import JoinChannel from '../../../components/upsell/joinChannel';
import RequestToJoinChannel from '../../../components/upsell/requestToJoinChannel';

const LoadingView = () => (
  <View>
    <Titlebar
      provideBack={true}
      backRoute={`/`}
      noComposer
      style={{ gridArea: 'header' }}
    />
    <Content>
      <Detail type="only">
        <LoadingThreadDetail />
        <ChatWrapper>
          <HorizontalRule>
            <hr />
            <Icon glyph={'message'} />
            <hr />
          </HorizontalRule>
          <LoadingChat />
        </ChatWrapper>
      </Detail>
    </Content>
  </View>
);

type Props = {
  data: {
    thread: Object,
  },
  isLoading: boolean,
  hasError: boolean,
  currentUser: Object,
  dispatch: Function,
  slider: boolean,
};

type State = {
  isLoading: boolean,
  scrollElement: any,
};

class ThreadContainer extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      scrollElement: null,
    };
  }

  componentDidMount() {
    track('thread', 'viewed', null);
    const elem = document.getElementById('scroller-for-inbox-thread-view');
    this.setState({
      // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
      // the AppViewWrapper which is the scrolling part of the site.
      scrollElement: elem,
    });
  }

  componentDidUpdate(prevProps) {
    // if the user is in the inbox and changes threads, it should initially scroll
    // to the top before continuing with logic to force scroll to the bottom
    const { scrollElement } = this.state;
    if (
      prevProps.data.thread &&
      prevProps.data.thread.id !== this.props.data.thread.id
    ) {
      if (scrollElement) {
        scrollElement.scrollTop = 0;
      }
    }

    // we never autofocus on mobile
    if (window && window.innerWidth < 768) return;

    const { currentUser, data: { thread } } = this.props;

    // if no thread has been returned yet from the query, we don't know whether or not to focus yet

    if (!thread) return;
    // only when the thread has been returned for the first time should evaluate whether or not to focus the chat input

    const threadAndUser = currentUser && thread;

    if (threadAndUser && this.chatInput) {
      this.chatInput.triggerFocus();
    }
  }

  forceScrollToBottom = () => {
    if (!this.scrollBody) return;
    let node = this.scrollBody;
    node.scrollTop = node.scrollHeight - node.clientHeight;
  };

  contextualScrollToBottom = () => {
    if (!this.scrollBody) return;
    let node = this.scrollBody;
    if (node.scrollHeight - node.clientHeight < node.scrollTop + 280) {
      node.scrollTop = node.scrollHeight - node.clientHeight;
    }
  };

  render() {
    const {
      data: { thread },
      data,
      currentUser,
      isLoading,
      hasError,
      slider,
      dispatch,
    } = this.props;

    const isLoggedIn = currentUser;

    if (data && data.thread) {
      // successful network request to get a thread
      const { title, description } = generateMetaInfo({
        type: 'thread',
        data: {
          title: thread.content.title,
          body: thread.content.body,
          type: thread.type,
          channelName: thread.channel.name,
        },
      });

      // if the user is new and signed up through a thread view, push
      // the thread's community data into the store to hydrate the new user experience
      // with their first community they should join
      dispatch(addCommunityToOnboarding(thread.channel.community));

      // get the data we need to render the view
      const {
        channelPermissions,
        isPrivate,
        community: { communityPermissions },
      } = thread.channel;
      const { isLocked, isCreator, participants } = thread;
      const isRestricted = isPrivate && !channelPermissions.isMember;
      const canSendMessages = currentUser && channelPermissions.isMember;
      const isChannelOwner = channelPermissions.isOwner;
      const isCommunityOwner = communityPermissions.isOwner;
      const canModerate = isChannelOwner || isCommunityOwner;
      const isParticipantOrCreator =
        currentUser &&
        (isCreator ||
          (participants &&
            participants.length > 0 &&
            participants.some(
              participant => participant.id === currentUser.id
            )));

      // if the thread is in a private channel where the user isn't a member the user can request to join the channel
      if (isRestricted) {
        return (
          <View>
            <Titlebar
              title={'Private thread'}
              provideBack={true}
              backRoute={`/`}
              noComposer
            />
            <Content>
              <Detail type="primary">
                <ViewError
                  heading={`This thread is private.`}
                  subheading={`Request to join this channel and the admins will be notified.`}
                >
                  <RequestToJoinChannel
                    channel={thread.channel}
                    community={thread.channel.community}
                    isPending={thread.channel.channelPermissions.isPending}
                  />
                </ViewError>
              </Detail>
            </Content>
          </View>
        );
      }

      return (
        <View slider={slider}>
          <Head title={title} description={description} />
          <Titlebar
            title={thread.content.title}
            subtitle={`${thread.channel.community.name} / ${thread.channel
              .name}`}
            provideBack={true}
            backRoute={`/`}
            noComposer
            style={{ gridArea: 'header' }}
          />
          <Content innerRef={scrollBody => (this.scrollBody = scrollBody)}>
            <Detail type="only">
              <ThreadDetail thread={thread} slider={slider} />

              <Messages
                threadType={thread.threadType}
                id={thread.id}
                currentUser={currentUser}
                forceScrollToBottom={this.forceScrollToBottom}
                contextualScrollToBottom={this.contextualScrollToBottom}
                shouldForceScrollOnMessageLoad={isParticipantOrCreator}
                hasMessagesToLoad={thread.messageCount > 0}
                canModerate={canModerate}
              />

              {isLocked && (
                <NullState copy="This conversation has been frozen by a moderator." />
              )}

              {isLoggedIn &&
                !canSendMessages && <JoinChannel channel={thread.channel} />}

              {!isLoggedIn && (
                <UpsellSignIn
                  title={'Join the conversation'}
                  glyph={'message-new'}
                  view={{ data: thread.community, type: 'community' }}
                  noShadow
                />
              )}
            </Detail>
          </Content>

          {isLoggedIn &&
            canSendMessages &&
            !isLocked && (
              <Input>
                <ChatInputWrapper type="only">
                  <ChatInput
                    threadType="story"
                    thread={thread.id}
                    currentUser={isLoggedIn}
                    forceScrollToBottom={this.forceScrollToBottom}
                    onRef={chatInput => (this.chatInput = chatInput)}
                  />
                </ChatInputWrapper>
              </Input>
            )}
        </View>
      );
    }

    if (isLoading) {
      return <LoadingView />;
    }

    return (
      <View slider={slider}>
        <ViewError
          heading={`We had trouble loading this thread.`}
          subheading={
            !hasError
              ? `It may be private, or may have been deleted by an author or moderator.`
              : ''
          }
          refresh={hasError}
        />
      </View>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export default compose(connect(map), getThread, viewNetworkHandler, pure)(
  ThreadContainer
);
