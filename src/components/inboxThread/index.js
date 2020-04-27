// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
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
import getSnippet from 'shared/clients/draft-js/utils/getSnippet';
import truncate from 'shared/truncate';

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

    const newUnseenThread =
      !active &&
      currentUser &&
      !thread.currentUserLastSeen &&
      thread.community.communityPermissions.isMember &&
      currentUser.id !== thread.author.user.id;

    return (
      <ErrorBoundary>
        <InboxThreadItem
          new={newMessagesSinceLastViewed || newUnseenThread}
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

              <ThreadSnippet active={active}>
                {getSnippet(JSON.parse(thread.content.body))}
              </ThreadSnippet>

              <ErrorBoundary>
                <ThreadActivity
                  thread={thread}
                  active={active}
                  currentUser={currentUser}
                  newMessages={!!newMessagesSinceLastViewed}
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
