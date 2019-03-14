// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import truncate from 'shared/truncate';
import Header from './header';
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
    } = this.props;

    const newMessagesSinceLastViewed =
      !active &&
      thread.currentUserLastSeen &&
      thread.lastActive &&
      thread.currentUserLastSeen < thread.lastActive;

    const nowTime = new Date().getTime();
    const publishedTime = new Date(thread.lastActive).getTime();
    const publishedInLastDay = nowTime - publishedTime < 86400;
    const newUnseenThreadInPastDay =
      !active &&
      currentUser &&
      !thread.currentUserLastSeen &&
      publishedInLastDay &&
      currentUser.id !== thread.author.user.id;

    const text = JSON.parse(thread.content.body).blocks.filter(
      ({ type }) => type === 'unstyled' || type.indexOf('header') === 0
    );
    const raw = text.map(block => block.text).join('\n');
    const withouteMultipleLineBreaks = raw.replace(/[\r\n]{3,}/g, '\n');
    const snippet = truncate(withouteMultipleLineBreaks, 280);

    return (
      <ErrorBoundary>
        <InboxThreadItem
          new={newMessagesSinceLastViewed || newUnseenThreadInPastDay}
          data-cy="thread-card"
          active={active}
        >
          <InboxLinkWrapper
            to={{
              pathname: getThreadLink(thread),
              state: { modal: false },
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
              <ErrorBoundary>
                <Header
                  thread={thread}
                  active={active}
                  viewContext={viewContext}
                  currentUser={currentUser}
                />
              </ErrorBoundary>

              <ThreadTitle active={active}>
                {truncate(thread.content.title, 80)}
              </ThreadTitle>

              <ThreadSnippet active={active}>{snippet}</ThreadSnippet>

              <ErrorBoundary>
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
