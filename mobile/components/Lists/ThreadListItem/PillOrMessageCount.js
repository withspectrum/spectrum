// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { withCurrentUser } from '../../WithCurrentUser';
import type { GetThreadType } from '../../../../shared/graphql/queries/thread/getThread';
import type { GetUserType } from '../../../../shared/graphql/queries/user/getUser';
import { Subtitle } from '../style';
import { MetaTextPill } from './style';

type Props = {
  thread: GetThreadType,
  currentUser: GetUserType,
};

class PillOrMessageCount extends React.Component<Props> {
  render() {
    const {
      currentUser,
      thread: {
        isLocked,
        currentUserLastSeen,
        lastActive,
        messageCount,
        createdAt,
        channel,
        community,
        author,
      },
    } = this.props;

    const isAuthor = currentUser.id === author.user.id;
    const isChannelMember = channel.channelPermissions.isMember;
    const isCommunityMember = community.communityPermissions.isMember;

    const now = new Date().getTime() / 1000;
    const createdAtTime = new Date(createdAt).getTime() / 1000;
    const lastActiveTime = lastActive && new Date(lastActive).getTime() / 1000;

    const defaultMessageCountString = (
      <Subtitle>
        {messageCount === 0
          ? `${messageCount} messages`
          : messageCount > 1
            ? `${messageCount} messages`
            : `${messageCount} message`}
      </Subtitle>
    );

    if (!isChannelMember || !isCommunityMember) {
      return defaultMessageCountString;
    }

    if (isLocked) {
      return <MetaTextPill locked>{`Locked`.toUpperCase()}</MetaTextPill>;
    }

    if (!isAuthor && !currentUserLastSeen) {
      if (now - createdAtTime > 86400) {
        return defaultMessageCountString;
      }

      return <MetaTextPill new>{`New thread!`.toUpperCase()}</MetaTextPill>;
    }

    if (currentUserLastSeen && lastActive && currentUserLastSeen < lastActive) {
      if (lastActiveTime && now - lastActiveTime > 86400 * 7) {
        return defaultMessageCountString;
      }

      return <Subtitle color={theme => theme.warn.alt}>New messages!</Subtitle>;
    }

    return defaultMessageCountString;
  }
}

export default compose(withCurrentUser)(PillOrMessageCount);
