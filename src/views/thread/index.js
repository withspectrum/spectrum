// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
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
import {
  getThreadByMatch,
  getThreadByMatchQuery,
} from 'shared/graphql/queries/thread/getThread';
import { NullState, UpsellSignIn } from '../../components/upsell';
import JoinChannel from '../../components/upsell/joinChannel';
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
  WatercoolerDescription,
  WatercoolerIntroContainer,
  WatercoolerTitle,
  WatercoolerAvatar,
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
  threadSliderIsOpen: boolean,
  client: Object,
};

type State = {
  scrollElement: any,
  isEditing: boolean,
  messagesContainer: any,
};

class ThreadContainer extends React.Component<Props, State> {
  chatInput: any;

  state = {
    messagesContainer: null,
    scrollElement: null,
    isEditing: false,
  };

  toggleEdit = () => {
    const { isEditing } = this.state;
    this.setState({
      isEditing: !isEditing,
    });
  };

  setMessagesContainer = elem => {
    if (this.state.messagesContainer) return;
    this.setState({
      messagesContainer: elem,
    });
  };

  // Locally update thread.currentUserLastSeen
  updateThreadLastSeen = threadId => {
    const { currentUser, client } = this.props;
    // No currentUser, no reason to update currentUserLastSeen
    if (!currentUser || !threadId) return;
    try {
      const threadData = client.readQuery({
        query: getThreadByMatchQuery,
        variables: {
          id: threadId,
        },
      });

      client.writeQuery({
        query: getThreadByMatchQuery,
        variables: {
          id: threadId,
        },
        data: {
          ...threadData,
          thread: {
            ...threadData.thread,
            currentUserLastSeen: new Date(),
            __typename: 'Thread',
          },
        },
      });
    } catch (err) {
      // Errors that happen with this shouldn't crash the app
      console.log(err);
    }
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
    if (
      prevProps.data &&
      prevProps.data.thread &&
      this.props.data &&
      this.props.data.thread &&
      prevProps.data.thread.id !== this.props.data.thread.id
    ) {
      track('thread', 'viewed', null);

      // if the user is new and signed up through a thread view, push
      // the thread's community data into the store to hydrate the new user experience
      // with their first community they should join
      this.props.dispatch(
        addCommunityToOnboarding(this.props.data.thread.community)
      );

      // Update thread.currentUserLastSeen for the last thread when we switch away from it
      if (prevProps.threadId) {
        this.updateThreadLastSeen(prevProps.threadId);
      }
      this.forceScrollToTop();
    }

    // we never autofocus on mobile
    if (window && window.innerWidth < 768) return;

    const { currentUser, data: { thread }, threadSliderIsOpen } = this.props;

    // if no thread has been returned yet from the query, we don't know whether or not to focus yet
    if (!thread) return;

    // only when the thread has been returned for the first time should evaluate whether or not to focus the chat input
    const threadAndUser = currentUser && thread;
    if (threadAndUser && this.chatInput) {
      // if the user is viewing the inbox, opens the thread slider, and then closes it again, refocus the inbox inpu
      if (prevProps.threadSliderIsOpen && !threadSliderIsOpen) {
        return this.chatInput.triggerFocus();
      }

      // if the thread slider is open while in the inbox, don't focus in the inbox
      if (threadSliderIsOpen) return;

      return this.chatInput.triggerFocus();
    }
  }

  forceScrollToTop = () => {
    const { messagesContainer } = this.state;
    if (!messagesContainer) return;
    messagesContainer.scrollTop = 0;
  };

  forceScrollToBottom = () => {
    const { messagesContainer } = this.state;
    if (!messagesContainer) return;
    const node = messagesContainer;
    node.scrollTop = node.scrollHeight - node.clientHeight;
  };

  contextualScrollToBottom = () => {
    const { messagesContainer } = this.state;
    if (!messagesContainer) return;
    const node = messagesContainer;
    if (node.scrollHeight - node.clientHeight < node.scrollTop + 280) {
      node.scrollTop = node.scrollHeight - node.clientHeight;
    }
  };

  render() {
    const {
      data: { thread },
      currentUser,
      isLoading,
      hasError,
      slider,
      threadViewContext = 'fullscreen',
    } = this.props;
    const { isEditing } = this.state;
    const isLoggedIn = currentUser;

    if (thread && thread.id) {
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
      const { channelPermissions } = thread.channel;
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

      const shouldRenderThreadSidebar = threadViewContext === 'fullscreen';

      if (thread.watercooler)
        return (
          <ThreadViewContainer
            data-e2e-id="thread-view"
            threadViewContext={threadViewContext}
            constrain={
              threadViewContext === 'slider' ||
              threadViewContext === 'fullscreen'
            }
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
                title={`The Watercooler · ${thread.community.name}`}
                description={`Watercooler chat for the ${
                  thread.community.name
                } community`}
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
              <Content innerRef={this.setMessagesContainer}>
                <Detail type={slider ? '' : 'only'}>
                  <WatercoolerIntroContainer>
                    <WatercoolerAvatar
                      src={thread.community.profilePhoto}
                      community
                      size={44}
                      radius={8}
                    />
                    <WatercoolerTitle>
                      The {thread.community.name} watercooler
                    </WatercoolerTitle>
                    <WatercoolerDescription>
                      Welcome to the {thread.community.name} watercooler, a new
                      space for general chat with everyone in the community.
                      Jump in to the conversation below or introduce yourself!
                    </WatercoolerDescription>
                  </WatercoolerIntroContainer>
                  {!isEditing && (
                    <Messages
                      threadMessageCount={thread.messageCount}
                      threadType={thread.threadType}
                      id={thread.id}
                      scrollContainer={this.state.messagesContainer}
                      currentUser={currentUser}
                      lastSeen={thread.currentUserLastSeen}
                      lastActive={thread.lastActive}
                      forceScrollToBottom={this.forceScrollToBottom}
                      forceScrollToTop={this.forceScrollToTop}
                      contextualScrollToBottom={this.contextualScrollToBottom}
                      shouldForceScrollOnMessageLoad={true}
                      shouldForceScrollToTopOnMessageLoad={false}
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
                        threadData={thread}
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

      return (
        <ThreadViewContainer
          data-e2e-id="thread-view"
          threadViewContext={threadViewContext}
          constrain={
            threadViewContext === 'slider' || threadViewContext === 'fullscreen'
          }
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
            <Content innerRef={this.setMessagesContainer}>
              <Detail type={slider ? '' : 'only'}>
                <ThreadCommunityBanner
                  hide={threadViewContext === 'fullscreen'}
                  thread={thread}
                />

                <ThreadDetail
                  toggleEdit={this.toggleEdit}
                  thread={thread}
                  slider={slider}
                />

                {!isEditing && (
                  <Messages
                    threadMessageCount={thread.messageCount}
                    threadType={thread.threadType}
                    id={thread.id}
                    scrollContainer={this.state.messagesContainer}
                    currentUser={currentUser}
                    lastSeen={thread.currentUserLastSeen}
                    lastActive={thread.lastActive}
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
                      threadData={thread}
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
export default compose(
  // $FlowIssue
  connect(map),
  getThreadByMatch,
  viewNetworkHandler,
  withApollo
)(ThreadContainer);
