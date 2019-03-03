// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import truncate from 'shared/truncate';
import Header from './header';
import { toPlainText, toState } from 'shared/draft-utils';
import { changeActiveThread } from 'src/actions/dashboardFeed';
import getThreadLink from 'src/helpers/get-thread-link';
import type { ThreadInfoType } from 'shared/graphql/fragments/thread/threadInfo';
import type { Dispatch } from 'redux';
import {
  InboxThreadItem,
  InboxLinkWrapper,
  InboxThreadContent,
  ThreadTitle,
  ThreadSnippet,
  Column,
  AvatarLink,
  CommunityAvatarLink,
} from './style';
import { UserAvatar, CommunityAvatar } from 'src/components/avatar';
import ThreadActivity from './activity';
import { ErrorBoundary } from 'src/components/error';
import { withCurrentUser } from 'src/components/withCurrentUser';

type Props = {
  active: boolean,
  dispatch: Dispatch<Object>,
  history: Object,
  location: Object,
  match: Object,
  staticContext: ?string,
  data: ThreadInfoType,
  viewContext?:
    | ?'inbox'
    | 'communityInbox'
    | 'communityProfile'
    | 'channelInbox'
    | 'channelProfile'
    | 'userProfile'
    | 'userProfileReplies',
  currentUser: ?Object,
};

class InboxThread extends React.Component<Props> {
  render() {
    const {
      data: thread,
      active,
      viewContext = null,
      currentUser,
      location,
    } = this.props;

    const isInbox =
      viewContext &&
      (viewContext === 'inbox' ||
        viewContext === 'communityInbox' ||
        viewContext === 'channelInbox');

    const newMessagesSinceLastViewed =
      !active &&
      thread.currentUserLastSeen &&
      thread.lastActive &&
      thread.currentUserLastSeen < thread.lastActive;

    return (
      <ErrorBoundary fallbackComponent={null}>
        <InboxThreadItem
          new={newMessagesSinceLastViewed}
          data-cy="thread-card"
          active={active}
        >
          <InboxLinkWrapper
            to={
              isInbox
                ? {
                    pathname: location.pathname,
                    search: `?t=${thread.id}`,
                  }
                : {
                    pathname: getThreadLink(thread),
                    state: { modal: true },
                  }
            }
            onClick={evt => {
              const isMobile = window.innerWidth < 768;
              if (isMobile && isInbox) {
                evt.preventDefault();
                this.props.history.push({
                  pathname: getThreadLink(thread),
                  state: { modal: true },
                });
              } else if (!isMobile) {
                this.props.dispatch(changeActiveThread(thread.id));
              }
            }}
          />

          <InboxThreadContent>
            {viewContext !== 'userProfile' &&
              viewContext !== 'userProfileReplies' && (
                <AvatarLink>
                  <UserAvatar
                    onlineBorderColor={active ? theme => theme.brand.alt : null}
                    user={thread.author.user}
                    size={40}
                  />
                </AvatarLink>
              )}

            {(viewContext === 'userProfile' ||
              viewContext === 'userProfileReplies') && (
              <CommunityAvatarLink>
                <CommunityAvatar community={thread.community} size={40} />
              </CommunityAvatarLink>
            )}

            <Column>
              <ErrorBoundary fallbackComponent={null}>
                <Header
                  thread={thread}
                  active={active}
                  viewContext={viewContext}
                  currentUser={currentUser}
                />
              </ErrorBoundary>

              <ThreadTitle active={active} new={newMessagesSinceLastViewed}>
                {truncate(thread.content.title, 80)}
              </ThreadTitle>

              {!isInbox && (
                <ThreadSnippet active={active} new={newMessagesSinceLastViewed}>
                  {truncate(
                    toPlainText(toState(JSON.parse(thread.content.body))),
                    280
                  )}
                </ThreadSnippet>
              )}

              <ErrorBoundary fallbackComponent={null}>
                <ThreadActivity
                  thread={thread}
                  active={active}
                  currentUser={currentUser}
                />
              </ErrorBoundary>
            </Column>
          </InboxThreadContent>
        </InboxThreadItem>
      </ErrorBoundary>
    );
  }
}

export default compose(
  withRouter,
  withCurrentUser,
  connect()
)(InboxThread);
