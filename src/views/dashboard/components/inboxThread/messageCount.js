// @flow
import * as React from 'react';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import Icon from 'src/components/icons';
import { CountWrapper, NewCount } from './style';

type Props = {
  currentUser: ?Object,
  thread: GetThreadType,
  active: boolean,
};

class MessageCount extends React.Component<Props> {
  render() {
    const {
      thread: { messageCount, currentUserLastSeen, lastActive },
      active,
    } = this.props;

    const newMessagesSinceLastViewed =
      currentUserLastSeen && lastActive && currentUserLastSeen < lastActive;

    return (
      <CountWrapper
        active={active}
        tipText={`${messageCount} messages`}
        tipLocation={'top-right'}
      >
        <Icon glyph="message-simple" size={24} />
        <span>{messageCount}</span>
        {newMessagesSinceLastViewed &&
          !active && <NewCount active={active}>(New)</NewCount>}
      </CountWrapper>
    );
  }
}

export default MessageCount;
