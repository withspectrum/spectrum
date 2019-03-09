// @flow
import React, { useEffect } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import {
  getThreadByMatch,
  getThreadByMatchQuery,
} from 'shared/graphql/queries/thread/getThread';
import { withCurrentUser } from 'src/components/withCurrentUser';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { LoadingView, ErrorView } from 'src/views/viewHelpers';
import {
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
import MessagesSubscriber from '../components/messagesSubscriber';
import StickyHeader from '../components/stickyHeader';
import ThreadDetail from '../components/threadDetail';
import ThreadHead from '../components/threadHead';
import LockedMessages from '../components/lockedMessages';
import DesktopAppUpsell from '../components/desktopAppUpsell';
import { Stretch } from '../style';

import { ChatInputWrapper } from '../style';

const ThreadContainer = (props: Props) => {
  const { data, isLoading, client, currentUser } = props;

  if (isLoading) return <LoadingView />;

  const { thread } = data;
  if (!thread) return <ErrorView />;

  /*
    update the last seen timestamp of the current thread whenever it first
    loads, as well as when it unmounts as the user closes the thread. This
    should provide the effect of locally marking the thread as "seen" while
    athena handles storing the actual lastSeen timestamp update in the background
    asynchronously
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
  useEffect(
    () => {
      updateThreadLastSeen();
      return () => updateThreadLastSeen();
    },
    [id]
  );

  const { community, channel, id, isLocked } = thread;
  const { communityPermissions } = community;
  const { isMember } = communityPermissions;
  const canChat = !isLocked && isMember;

  return (
    <React.Fragment>
      <ThreadHead thread={thread} />

      <SecondaryPrimaryColumnGrid>
        <SecondaryColumn>
          <DesktopAppUpsell />

          <SidebarSection>
            <CommunityProfileCard community={community} />
          </SidebarSection>

          <SidebarSection>
            <ChannelProfileCard hideCommunityMeta channel={channel} />
          </SidebarSection>
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
            />
          </Stretch>

          {canChat && (
            <ChatInputWrapper>
              <ChatInput threadType="story" thread={thread} />
            </ChatInputWrapper>
          )}

          {isLocked && (
            <ChatInputWrapper>
              <LockedMessages />
            </ChatInputWrapper>
          )}
        </PrimaryColumn>
      </SecondaryPrimaryColumnGrid>
    </React.Fragment>
  );
};

export default compose(
  getThreadByMatch,
  viewNetworkHandler,
  withRouter,
  withApollo,
  withCurrentUser,
  connect()
)(ThreadContainer);
