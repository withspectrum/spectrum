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
  IconWrapper,
} from './style';
import { UserAvatar, CommunityAvatar } from 'src/components/avatar';
import ThreadActivity from './activity';
import LastMessage from './lastMessage';
import { ErrorBoundary } from 'src/components/error';
import { withCurrentUser } from 'src/components/withCurrentUser';
import Icon from 'src/components/icons';

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

class WatercoolerThread extends React.Component<Props> {
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
            <IconWrapper>
              <Icon glyph={'message'} size={32} />
            </IconWrapper>

            <Column>
              <ErrorBoundary fallbackComponent={null}>
                <ThreadActivity
                  thread={thread}
                  active={active}
                  currentUser={currentUser}
                />
              </ErrorBoundary>

              <ErrorBoundary fallbackComponent={null}>
                <LastMessage
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
)(WatercoolerThread);
