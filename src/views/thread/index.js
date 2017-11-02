import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { track } from '../../helpers/events';
import generateMetaInfo from 'shared/generate-meta-info';
import { addCommunityToOnboarding } from '../../actions/newUserOnboarding';
import Titlebar from '../../views/titlebar';
import ThreadDetail from './components/threadDetail';
import Messages from './components/messages';
import Head from '../../components/head';
import ChatInput from '../../components/chatInput';
import ViewError from '../../components/viewError';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import { getThread } from './queries';
import { NullState, UpsellSignIn } from '../../components/upsell';
import JoinChannel from '../../components/upsell/joinChannel';
import RequestToJoinChannel from '../../components/upsell/requestToJoinChannel';
import LoadingView from './components/loading';
import ThreadCommunityBanner from './components/threadCommunityBanner';
import Sidebar from './components/sidebar';
import {
  ThreadViewContainer,
  ThreadContentView,
  Content,
  Input,
  Detail,
  ChatInputWrapper,
} from './style';

type Props = {
  data: {
    thread: Object,
  },
  isLoading: boolean,
  hasError: boolean,
  currentUser: Object,
  dispatch: Function,
  slider: boolean,
  threadViewContext: 'slider' | 'fullscreen' | 'inbox',
};

type State = {
  scrollElement: any,
  isEditing: boolean,
};

class ThreadContainer extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      scrollElement: null,
      isEditing: false,
    };
  }

  toggleEdit = () => {
    const { isEditing } = this.state;
    this.setState({
      isEditing: !isEditing,
    });
  };

  componentDidMount() {
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
      track('thread', 'viewed', null);

      // if the user is new and signed up through a thread view, push
      // the thread's community data into the store to hydrate the new user experience
      // with their first community they should join
      this.props.dispatch(
        addCommunityToOnboarding(this.props.data.thread.community)
      );

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

  forceScrollToTop = () => {
    if (!this.scrollBody) return;
    let node = this.scrollBody;
    node.scrollTop = 0;
  };

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
      threadViewContext = 'fullscreen',
    } = this.props;
    const { isEditing } = this.state;
    const isLoggedIn = currentUser;

    if (thread) {
      // successful network request to get a thread
      const { title, description } = generateMetaInfo({
        type: 'thread',
        data: {
          title: thread.content.title,
          body: thread.content.body,
          type: thread.type,
          communityName: thread.community.name,
        },
      });

      // get the data we need to render the view
      const { channelPermissions, isPrivate } = thread.channel;
      const { communityPermissions } = thread.community;
      const { isLocked, isCreator, participants } = thread;
      const canSendMessages = isLoggedIn && channelPermissions.isMember;
      const isChannelOwner = currentUser && channelPermissions.isOwner;
      const isCommunityOwner = currentUser && communityPermissions.isOwner;
      const isModerator = isChannelOwner || isCommunityOwner;
      const isParticipantOrCreator =
        currentUser &&
        (isCreator ||
          (participants &&
            participants.length > 0 &&
            participants.some(
              participant => participant.id === currentUser.id
            )));

      const shouldRenderThreadSidebar =
        threadViewContext === 'fullscreen' && window.innerWidth > 1024;

      // only show the community header in inbox, sliders, and narrow screen thread views
      const shouldRenderCommunityContextHeader =
        threadViewContext === 'inbox' ||
        threadViewContext === 'slider' ||
        (threadViewContext === 'fullscreen' && window.innerWidth < 1024);

      return (
        <ThreadViewContainer
          data-e2e-id="thread-view"
          threadViewContext={threadViewContext}
        >
          {shouldRenderThreadSidebar && (
            <Sidebar
              thread={thread}
              currentUser={currentUser}
              slug={thread.community.slug}
              id={thread.community.id}
            />
          )}

          <ThreadContentView slider={slider}>
            <Head
              title={title}
              description={description}
              image={thread.community.profilePhoto}
            />
            <Titlebar
              title={thread.content.title}
              subtitle={`${thread.community.name} / ${thread.channel.name}`}
              provideBack={true}
              backRoute={`/`}
              noComposer
              style={{ gridArea: 'header' }}
            />
            <Content innerRef={scrollBody => (this.scrollBody = scrollBody)}>
              <Detail type={slider ? '' : 'only'}>
                {shouldRenderCommunityContextHeader && (
                  <ThreadCommunityBanner thread={thread} />
                )}

                <ThreadDetail
                  toggleEdit={this.toggleEdit}
                  thread={thread}
                  slider={slider}
                />

                {!isEditing && (
                  <Messages
                    threadType={thread.threadType}
                    id={thread.id}
                    currentUser={currentUser}
                    forceScrollToBottom={this.forceScrollToBottom}
                    forceScrollToTop={this.forceScrollToTop}
                    contextualScrollToBottom={this.contextualScrollToBottom}
                    shouldForceScrollOnMessageLoad={isParticipantOrCreator}
                    shouldForceScrollToTopOnMessageLoad={
                      !isParticipantOrCreator
                    }
                    hasMessagesToLoad={thread.messageCount > 0}
                    isModerator={isModerator}
                  />
                )}

                {!isEditing &&
                  isLocked && (
                    <NullState copy="This conversation has been frozen by a moderator." />
                  )}

                {!isEditing &&
                  isLoggedIn &&
                  !canSendMessages && (
                    <JoinChannel
                      community={thread.community}
                      channel={thread.channel}
                    />
                  )}

                {!isEditing &&
                  !isLoggedIn && (
                    <UpsellSignIn
                      title={`Join the ${thread.community.name} community`}
                      glyph={'message-new'}
                      view={{ data: thread.community, type: 'community' }}
                      noShadow
                    />
                  )}
              </Detail>
            </Content>

            {!isEditing &&
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
          </ThreadContentView>
        </ThreadViewContainer>
      );
    }

    if (isLoading) {
      return <LoadingView threadViewContext={threadViewContext} />;
    }

    return (
      <ThreadViewContainer threadViewContext={threadViewContext}>
        <ThreadContentView
          threadViewContext={threadViewContext}
          slider={slider}
        >
          <ViewError
            heading={`We had trouble loading this thread.`}
            subheading={
              !hasError
                ? `It may be private, or may have been deleted by an author or moderator.`
                : ''
            }
            refresh={hasError}
          />
        </ThreadContentView>
      </ThreadViewContainer>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export default compose(connect(map), getThread, viewNetworkHandler)(
  ThreadContainer
);
