// @flow
import * as React from 'react';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import MessageCount from './messageCount';
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
