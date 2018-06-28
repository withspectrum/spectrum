// @flow
import * as React from 'react';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import Icon from 'src/components/icons';
import { CountWrapper } from './style';

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
        new={newMessagesSinceLastViewed}
        tipText={`${messageCount} messages`}
        tipLocation={'top-right'}
      >
        <Icon glyph="message" size={24} />
        <span>{messageCount}</span>
      </CountWrapper>
    );
  }
}

export default MessageCount;
