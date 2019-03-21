// @flow
import React, { useEffect, useState } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import {
  getThreadByMatch,
  getThreadByMatchQuery,
} from 'shared/graphql/queries/thread/getThread';
import { markSingleNotificationSeenMutation } from 'shared/graphql/mutations/notification/markSingleNotificationSeen';
import { withCurrentUser } from 'src/components/withCurrentUser';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import { LoadingView, ErrorView } from 'src/views/viewHelpers';
import JoinCommunity from 'src/components/joinCommunityWrapper';
import Icon from 'src/components/icon';
import { PrimaryOutlineButton } from 'src/components/button';
import {
  ViewGrid,
  SecondaryPrimaryColumnGrid,
  PrimaryColumn,
  SecondaryColumn,
} from 'src/components/layout';
import {
  CommunityProfileCard,
  ChannelProfileCard,
} from 'src/components/entities';
import { SidebarSection } from 'src/views/community/style';
import ChatInput from 'src/components/chatInput';
import { setTitlebarProps } from 'src/actions/titlebar';
import MessagesSubscriber from '../components/messagesSubscriber';
import TrendingThreads from '../components/trendingThreads';
import StickyHeader from '../components/stickyHeader';
import ThreadDetail from '../components/threadDetail';
import ThreadHead from '../components/threadHead';
import LockedMessages from '../components/lockedMessages';
import DesktopAppUpsell from '../components/desktopAppUpsell';
import TopBottomButtons from '../components/topBottomButtons';
import { ChatInputWrapper } from 'src/components/layout';
import { Stretch, LockedText } from '../style';
import { deduplicateChildren } from 'src/components/infiniteScroll/deduplicateChildren';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';

type Props = {
  ...$Exact<ViewNetworkHandlerType>,
  data: {
    thread: GetThreadType,
  },
  client: Object,
  currentUser?: Object,
  dispatch: Function,
  notifications: Array<Object>,
};

const ThreadContainer = (props: Props) => {
  const { data, isLoading, client, currentUser, dispatch } = props;

  if (isLoading) return <LoadingView />;

  const { thread } = data;
  if (!thread) return <ErrorView data-cy="null-thread-view" />;

  const { id } = thread;

  /*
  update the last seen timestamp of the current thread whenever it first
  loads, as well as when it unmounts as the user closes the thread. This
  should provide the effect of locally marking the thread as "seen" while
  athena handles storing the actual lastSeen timestamp update in the background
  asynchronously.
  */
  const updateThreadLastSeen = () => {
    if (!currentUser || !thread) return;
    try {
      const threadData = client.readQuery({
        query: getThreadByMatchQuery,
        variables: {
          id,
        },
      });

      client.writeQuery({
        query: getThreadByMatchQuery,
        variables: {
          id,
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

  const [mentionSuggestions, setMentionSuggestions] = useState([
    thread.author.user,
  ]);
  const updateMentionSuggestions = (thread: GetThreadType) => {
    const { messageConnection, author } = thread;

    if (!messageConnection || messageConnection.edges.length === 0)
      return setMentionSuggestions([author.user]);

    const participants = messageConnection.edges
      .map(edge => edge.node)
      .map(node => node.author.user);

    const participantsWithAuthor = [...participants, author.user];
    const filtered = deduplicateChildren(participantsWithAuthor, 'id');
    return setMentionSuggestions(filtered);
  };

  const markCurrentThreadNotificationsAsSeen = () => {
    if (!currentUser || !thread) return;
    try {
      props.notifications.forEach(notification => {
        if (notification.isSeen) return;

        const notificationContextIds =
          notification.type === 'THREAD_CREATED'
            ? notification.entities.map(entity => entity.id)
            : [notification.context.id];

        if (notificationContextIds.indexOf(id) === -1) return;

        props.client.mutate({
          mutation: markSingleNotificationSeenMutation,
          variables: {
            id: notification.id,
          },
        });
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    markCurrentThreadNotificationsAsSeen();
  }, [id, props.notifications.length]);

  useEffect(() => {
    updateThreadLastSeen();
    return () => updateThreadLastSeen();
  }, [id]);

  useEffect(() => {
    dispatch(
      setTitlebarProps({
        title: 'Conversation',
        leftAction: 'view-back',
      })
    );
  }, []);

  const { community, channel, isLocked } = thread;
  const { communityPermissions } = community;
  const { isMember } = communityPermissions;
  const canChat = !isLocked && !channel.isArchived && isMember;

  return (
    <React.Fragment>
      <ThreadHead thread={thread} />
      <TopBottomButtons />
      <ViewGrid data-cy="thread-view">
        <SecondaryPrimaryColumnGrid>
          <SecondaryColumn>
            <SidebarSection>
              <CommunityProfileCard community={community} />
            </SidebarSection>

            <SidebarSection>
              <ChannelProfileCard
                hideActions
                hideCommunityMeta
                channel={channel}
              />
            </SidebarSection>

            <SidebarSection>
              <TrendingThreads id={community.id} />
            </SidebarSection>

            <DesktopAppUpsell />
          </SecondaryColumn>

          <PrimaryColumn>
            {/*
              This <Stretch> container makes sure that the thread detail and messages
              component are always at least the height of the screen, minus the
              height of the chat input. This is necessary because we always want
              the chat input at the bottom of the view, so it must always be tricked
              into thinking that its preceeding sibling is full-height.
            */}
            <Stretch>
              <StickyHeader thread={thread} />
              <ThreadDetail thread={thread} />

              <MessagesSubscriber
                id={thread.id}
                thread={thread}
                isWatercooler={thread.watercooler} // used in the graphql query to always fetch the latest messages
                onMessagesLoaded={updateMentionSuggestions}
              />

              {canChat && (
                <ChatInputWrapper>
                  <ChatInput
                    threadType="story"
                    threadId={thread.id}
                    participants={mentionSuggestions}
                  />
                </ChatInputWrapper>
              )}

              {!canChat && !isLocked && (
                <ChatInputWrapper>
                  <JoinCommunity
                    community={community}
                    render={({ isLoading }) => (
                      <LockedMessages>
                        <PrimaryOutlineButton
                          isLoading={isLoading}
                          icon={'door-enter'}
                          data-cy="join-community-chat-upsell"
                        >
                          {isLoading ? 'Joining...' : 'Join community to chat'}
                        </PrimaryOutlineButton>
                      </LockedMessages>
                    )}
                  />
                </ChatInputWrapper>
              )}

              {isLocked && (
                <ChatInputWrapper>
                  <LockedMessages>
                    <Icon glyph={'private'} size={24} />
                    <LockedText>This conversation has been locked</LockedText>
                  </LockedMessages>
                </ChatInputWrapper>
              )}

              {channel.isArchived && (
                <ChatInputWrapper>
                  <LockedMessages>
                    <Icon glyph={'private'} size={24} />
                    <LockedText>This channel has been archived</LockedText>
                  </LockedMessages>
                </ChatInputWrapper>
              )}
            </Stretch>
          </PrimaryColumn>
        </SecondaryPrimaryColumnGrid>
      </ViewGrid>
    </React.Fragment>
  );
};

const mapStateToProps = (state): * => ({
  notifications: state.notifications.notificationsData,
});

export default compose(
  getThreadByMatch,
  viewNetworkHandler,
  withRouter,
  withApollo,
  withCurrentUser,
  connect(mapStateToProps)
)(ThreadContainer);
