// @flow
import React, { useEffect, useState } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import { getThreadByMatch } from 'shared/graphql/queries/thread/getThread';
import { withCurrentUser } from 'src/components/withCurrentUser';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import { LoadingView, ErrorView } from 'src/views/viewHelpers';
import {
  ViewGrid,
  SecondaryPrimaryColumnGrid,
  PrimaryColumn,
  SecondaryColumn,
  SingleColumnGrid,
} from 'src/components/layout';
import { setTitlebarProps } from 'src/actions/titlebar';
import MessagesSubscriber from '../components/messagesSubscriber';
import StickyHeader from '../components/stickyHeader';
import ThreadDetail from '../components/threadDetail';
import ThreadHead from '../components/threadHead';
import { Stretch } from '../style';
import { deduplicateChildren } from 'src/components/infiniteScroll/deduplicateChildren';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import CommunitySidebar from 'src/components/communitySidebar';
import { ErrorBoundary } from 'src/components/error';

type Props = {
  ...$Exact<ViewNetworkHandlerType>,
  data: {
    thread: GetThreadType,
  },
  client: Object,
  className?: string,
  currentUser?: Object,
  dispatch: Function,
  isModal: boolean,
  children: React$Node,
};

const ThreadContainer = (props: Props) => {
  const {
    data,
    isLoading,
    children,
    dispatch,
    className,
    isModal = false,
  } = props;

  if (isLoading) return <LoadingView />;

  const { thread } = data;
  if (!thread) return <ErrorView data-cy="null-thread-view" />;

  /*
  update the last seen timestamp of the current thread whenever it first
  loads, as well as when it unmounts as the user closes the thread. This
  should provide the effect of locally marking the thread as "seen" while
  athena handles storing the actual lastSeen timestamp update in the background
  asynchronously.
  */

  const [, setMentionSuggestions] = useState([thread.author.user]);
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

  useEffect(() => {
    dispatch(
      setTitlebarProps({
        title: 'Conversation',
        leftAction: 'view-back',
      })
    );
  }, []);

  const renderPrimaryColumn = fullWidth => (
    <PrimaryColumn fullWidth={fullWidth}>
      {/*
        This <Stretch> container makes sure that the thread detail and messages
        component are always at least the height of the screen, minus the
        height of the chat input. This is necessary because we always want
        the chat input at the bottom of the view, so it must always be tricked
        into thinking that its preceding sibling is full-height.
      */}
      <Stretch
        isModal={isModal}
        data-cy={isModal ? 'thread-is-modal' : undefined}
      >
        <ErrorBoundary>
          <StickyHeader thread={thread} />
        </ErrorBoundary>

        <ThreadDetail thread={thread} />

        <MessagesSubscriber
          id={thread.id}
          thread={thread}
          isWatercooler={thread.watercooler} // used in the graphql query to always fetch the latest messages
          onMessagesLoaded={updateMentionSuggestions}
        />
      </Stretch>
    </PrimaryColumn>
  );

  return (
    <React.Fragment>
      <ThreadHead thread={thread} />
      <ViewGrid className={className} data-cy="thread-view">
        {children}
        {isModal ? (
          <SingleColumnGrid>{renderPrimaryColumn(true)}</SingleColumnGrid>
        ) : (
          <SecondaryPrimaryColumnGrid>
            <SecondaryColumn>
              <CommunitySidebar community={thread.community} />
            </SecondaryColumn>
            {renderPrimaryColumn(false)}
          </SecondaryPrimaryColumnGrid>
        )}
      </ViewGrid>
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
