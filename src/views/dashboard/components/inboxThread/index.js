// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import truncate from 'shared/truncate';
import Header from './header';
import { changeActiveThread } from 'src/actions/dashboardFeed';
import type { ThreadInfoType } from 'shared/graphql/fragments/thread/threadInfo';
import type { Dispatch } from 'redux';
import {
  InboxThreadItem,
  InboxLinkWrapper,
  InboxThreadContent,
  ThreadTitle,
  Column,
  AvatarLink,
  CommunityAvatarLink,
  TagsContainer,
} from './style';
import { UserAvatar, CommunityAvatar } from 'src/components/avatar';
import ThreadActivity from './activity';
import { ErrorBoundary } from 'src/components/error';
import { withCurrentUser } from 'src/components/withCurrentUser';
import ThreadTag from 'src/views/communitySettings/components/threadTag';

type Props = {
  active: boolean,
  dispatch: Dispatch<Object>,
  history: Object,
  location: Object,
  match: Object,
  staticContext: ?string,
  data: ThreadInfoType,
  viewContext?:
    | ?'communityInbox'
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
      location,
      active,
      viewContext = null,
      currentUser,
    } = this.props;

    // TODO(@mxstbr): Fix this to not use window.innerWidth
    // which breaks SSR rehydration on mobile devices
    const isDesktopInbox =
      window.innerWidth > 768 &&
      (!viewContext ||
        viewContext === 'communityInbox' ||
        viewContext === 'channelInbox');

    let queryPrefix;
    if (isDesktopInbox) {
      queryPrefix = '?t';
    } else {
      queryPrefix = '?thread';
    }

    const newMessagesSinceLastViewed =
      !active &&
      thread.currentUserLastSeen &&
      thread.lastActive &&
      thread.currentUserLastSeen < thread.lastActive;

    const canViewTags =
      thread &&
      thread.community.communityPermissions &&
      (thread.community.communityPermissions.isOwner ||
        thread.community.communityPermissions.isModerater);

    return (
      <ErrorBoundary fallbackComponent={null}>
        <InboxThreadItem active={active}>
          <InboxLinkWrapper
            to={{
              pathname: location.pathname,
              search: `${queryPrefix}=${thread.id}`,
            }}
            onClick={() =>
              isDesktopInbox &&
              this.props.dispatch(changeActiveThread(thread.id))
            }
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

              {canViewTags && thread.tags && thread.tags.length > 0 && (
                <TagsContainer>
                  {thread.tags.map(tag => {
                    return <ThreadTag key={tag.id} tag={tag} size={'mini'} />;
                  })}
                </TagsContainer>
              )}

              <ThreadTitle active={active} new={newMessagesSinceLastViewed}>
                {truncate(thread.content.title, 80)}
              </ThreadTitle>

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
