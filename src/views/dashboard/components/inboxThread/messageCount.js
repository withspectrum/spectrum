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
    const { thread: { messageCount }, active } = this.props;

    return (
      <CountWrapper
        active={active}
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
