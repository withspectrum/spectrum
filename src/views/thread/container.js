// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
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
import { NullState } from '../../components/upsell';
import JoinChannel from '../../components/upsell/joinChannel';
import LoadingView from './components/loading';
import ThreadCommunityBanner from './components/threadCommunityBanner';
import Sidebar from './components/sidebar';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import type { Dispatch } from 'redux';
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
import WatercoolerActionBar from './components/watercoolerActionBar';
import { ErrorBoundary } from 'src/components/error';

type Props = {
  data: {
    thread: GetThreadType,
    refetch: Function,
  },
  isLoading: boolean,
  hasError: boolean,
  currentUser: Object,
  dispatch: Dispatch<Object>,
  slider: boolean,
  threadViewContext: 'slider' | 'fullscreen' | 'inbox',
  threadSliderIsOpen: boolean,
  client: Object,
};

type State = {
  scrollElement: any,
  isEditing: boolean,
  messagesContainer: any,
  // Cache lastSeen so it doesn't jump around
  // while looking at a live thread
  lastSeen: ?number | ?string,
  bannerIsVisible: boolean,
  stickToBottom: boolean,
};

class ThreadContainer extends React.Component<Props, State> {
  chatInput: any;

  // used to keep track of the height of the thread content element to determine
  // whether or not to show the contextual thread header banner
  threadDetailElem: any;
  threadDetailElem = null;

  state = {
    messagesContainer: null,
    scrollElement: null,
    isEditing: false,
    lastSeen: null,
    bannerIsVisible: false,
    scrollOffset: 0,
    stickToBottom: false,
  };

  componentWillReceiveProps(next: Props) {
    const curr = this.props;
    const newThread = !curr.data.thread && next.data.thread;
    const threadChanged =
      curr.data.thread &&
      next.data.thread &&
      curr.data.thread.id !== next.data.thread.id;
    // Update the cached lastSeen value when switching threads
    if (newThread || threadChanged) {
      const stickToBottom =
        !!next.data.thread.watercooler ||
        !next.currentUser ||
        next.data.thread.isAuthor ||
        !next.data.thread.currentUserLastSeen ||
        next.data.thread.participants
          .filter(Boolean)
          .some(user => user.id === next.currentUser.id);

      this.setState({
        lastSeen: next.data.thread.currentUserLastSeen
          ? next.data.thread.currentUserLastSeen
          : null,
        stickToBottom,
      });
    }
  }

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
      console.error(err);
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

  handleScroll = e => {
    e.persist();
    if (!e || !e.target) return;

    // whenever the user scrolls in the thread we determine if they've scrolled
    // past the thread content section - once they've scroll passed it, we
    // enable the `bannerIsVisible` state to slide the thread context banner
    // in from the top of the screen
    const scrollOffset = e.target.scrollTop;
    try {
      const threadDetail = ReactDOM.findDOMNode(this.threadDetailElem);
      const messagesContainer = ReactDOM.findDOMNode(
        this.state.messagesContainer
      );
      if (!threadDetail) return;

      requestAnimationFrame(() => {
        const {
          height: threadDetailHeight,
          // $FlowFixMe
        } = threadDetail.getBoundingClientRect();
        const {
          height: messagesContainerHeight,
          // $FlowFixMe
        } = messagesContainer.getBoundingClientRect();
        // $FlowFixMe
        const messagesContainerScrollHeight = messagesContainer.scrollHeight;
        // To stick to the bottom we invert the scroll container, so we have to adjust our calculation of the scroll position
        const bannerShouldBeVisible = this.state.stickToBottom
          ? messagesContainerScrollHeight - messagesContainerHeight >
            scrollOffset + threadDetailHeight
          : scrollOffset > threadDetailHeight;
        if (bannerShouldBeVisible !== this.state.bannerIsVisible) {
          this.setState({
            bannerIsVisible: bannerShouldBeVisible,
          });
        }
      });
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error(err);
      }
    }
  };

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
    return;
  };

  contextualScrollToBottom = () => {
    const { messagesContainer } = this.state;
    if (!messagesContainer) return;
    const node = messagesContainer;
    if (node.scrollHeight - node.clientHeight < node.scrollTop + 280) {
      node.scrollTop = node.scrollHeight - node.clientHeight;
    }
  };

  renderChatInputOrUpsell = () => {
    const { isEditing } = this.state;
    const { data: { thread }, currentUser } = this.props;

    if (!thread) return null;
    if (thread.isLocked) return null;
    if (isEditing) return null;
    if (thread.channel.isArchived) return null;

    const { channelPermissions } = thread.channel;
    const { communityPermissions } = thread.community;

    const isBlockedInChannelOrCommunity =
      channelPermissions.isBlocked || communityPermissions.isBlocked;

    if (isBlockedInChannelOrCommunity) return null;

    const chatInputComponent = (
      <Input>
        <ChatInputWrapper>
          <ChatInput
            threadType="story"
            threadData={thread}
            thread={thread.id}
            currentUser={currentUser}
            forceScrollToBottom={this.forceScrollToBottom}
            onRef={chatInput => (this.chatInput = chatInput)}
            refetchThread={this.props.data.refetch}
          />
        </ChatInputWrapper>
      </Input>
    );

    if (!currentUser) {
      return chatInputComponent;
    }

    if (currentUser && !currentUser.id) {
      return chatInputComponent;
    }

    if (channelPermissions.isMember) {
      return chatInputComponent;
    }

    return (
      <JoinChannel channel={thread.channel} community={thread.community} />
    );
  };

  renderPost = () => {
    const { data: { thread }, slider, currentUser } = this.props;
    if (!thread || !thread.id) return null;

    if (thread.watercooler) {
      return (
        <React.Fragment>
          <WatercoolerIntroContainer
            innerRef={c => (this.threadDetailElem = c)}
          >
            <WatercoolerAvatar
              src={thread.community.profilePhoto}
              community
              size={44}
            />
            <WatercoolerTitle>
              The {thread.community.name} watercooler
            </WatercoolerTitle>
            <WatercoolerDescription>
              Welcome to the {thread.community.name} watercooler, a space for
              general chat with everyone in the community. Jump in to the
              conversation below or introduce yourself!
            </WatercoolerDescription>
          </WatercoolerIntroContainer>

          <WatercoolerActionBar thread={thread} currentUser={currentUser} />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <ThreadDetail
          toggleEdit={this.toggleEdit}
          thread={thread}
          slider={slider}
          ref={c => (this.threadDetailElem = c)}
        />
      </React.Fragment>
    );
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
    const { isEditing, lastSeen } = this.state;

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
      const { isLocked } = thread;
      const shouldRenderThreadSidebar = threadViewContext === 'fullscreen';

      if (channelPermissions.isBlocked || communityPermissions.isBlocked) {
        return (
          <ErrorBoundary>
            <ThreadViewContainer
              threadViewContext={threadViewContext}
              constrain={
                threadViewContext === 'slider' ||
                threadViewContext === 'fullscreen'
              }
              data-cy="blocked-thread-view"
            >
              <ThreadContentView slider={slider}>
                <ViewError
                  emoji={'✋'}
                  heading={'You don’t have permission to view this thread'}
                  subheading={`This thread may have been deleted or does not exist.`}
                />
              </ThreadContentView>
            </ThreadViewContainer>
          </ErrorBoundary>
        );
      }

      const isWatercooler = thread.watercooler;
      const headTitle = isWatercooler
        ? `The Watercooler · ${thread.community.name}`
        : title;
      const headDescription = isWatercooler
        ? `Watercooler chat for the ${thread.community.name} community`
        : description;
      const { stickToBottom } = this.state;

      return (
        <ErrorBoundary>
          <ThreadViewContainer
            data-cy="thread-view"
            constrain={
              threadViewContext === 'slider' ||
              threadViewContext === 'fullscreen'
            }
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

            <ThreadContentView slider={slider} onScroll={this.handleScroll}>
              <Head
                title={headTitle}
                description={headDescription}
                image={thread.community.profilePhoto}
              />
              <Titlebar
                title={thread.content.title}
                subtitle={`${thread.community.name} / ${thread.channel.name}`}
                provideBack={true}
                backRoute={'/'}
                noComposer
                style={{ gridArea: 'header' }}
              />

              <ThreadCommunityBanner
                forceScrollToTop={this.forceScrollToTop}
                thread={thread}
                isVisible={this.state.bannerIsVisible}
              />

              <Content
                invert={stickToBottom}
                innerRef={this.setMessagesContainer}
              >
                <Detail invert={stickToBottom} type={slider ? '' : 'only'}>
                  {this.renderPost()}

                  {!isEditing && (
                    <Messages
                      id={thread.id}
                      scrollContainer={this.state.messagesContainer}
                      lastSeen={lastSeen}
                      forceScrollToBottom={this.forceScrollToBottom}
                      forceScrollToTop={this.forceScrollToTop}
                      contextualScrollToBottom={this.contextualScrollToBottom}
                      thread={thread}
                      isWatercooler={thread.watercooler} // used in the graphql query to always fetch the latest messages
                    />
                  )}

                  {!isEditing &&
                    isLocked && (
                      <NullState
                        icon="private"
                        copy="This conversation has been locked."
                      />
                    )}
                </Detail>
              </Content>

              {this.renderChatInputOrUpsell()}
            </ThreadContentView>
          </ThreadViewContainer>
        </ErrorBoundary>
      );
    }

    if (isLoading) {
      return <LoadingView threadViewContext={threadViewContext} />;
    }

    return (
      <ErrorBoundary>
        <ThreadViewContainer
          threadViewContext={threadViewContext}
          data-cy="null-thread-view"
        >
          <ThreadContentView
            threadViewContext={threadViewContext}
            slider={slider}
          >
            <ViewError
              heading={'We had trouble loading this thread.'}
              subheading={
                !hasError
                  ? 'It may be private, or may have been deleted by an author or moderator.'
                  : ''
              }
              refresh={hasError}
            />
          </ThreadContentView>
        </ThreadViewContainer>
      </ErrorBoundary>
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
