// @flow
import * as React from 'react';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import MessageCount from './messageCount';
import { LikeCount } from 'src/components/threadLikes';
import { ThreadActivityWrapper } from './style';

type Props = {
  currentUser: ?Object,
  thread: GetThreadType,
  active: boolean,
};

class ThreadActivity extends React.Component<Props> {
  render() {
    const { thread, active, currentUser } = this.props;

    if (!thread) return null;

    return (
      <ThreadActivityWrapper>
        <LikeCount thread={thread} active={active} />
        <MessageCount
          currentUser={currentUser}
          thread={thread}
          active={active}
        />
      </ThreadActivityWrapper>
    );
  }
}

export default ThreadActivity;
