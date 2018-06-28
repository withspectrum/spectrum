// @flow
import * as React from 'react';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import MessageCount from './messageCount';
import { LikeCount } from 'src/components/threadLikes';
import { NewThreadPill, ThreadActivityWrapper } from './style';

type Props = {
  currentUser: ?Object,
  thread: GetThreadType,
  active: boolean,
};

class ThreadActivity extends React.Component<Props> {
  render() {
    const {
      thread,
      thread: { createdAt, currentUserLastSeen },
      active,
      currentUser,
    } = this.props;

    if (!thread) return null;

    const now = new Date().getTime() / 1000;
    const createdAtTime = new Date(createdAt).getTime() / 1000;
    const createdMoreThanOneDayAgo = now - createdAtTime > 86400;
    const isAuthor = currentUser && currentUser.id === thread.author.user.id;

    if (!isAuthor && !currentUserLastSeen && !createdMoreThanOneDayAgo) {
      return (
        <ThreadActivityWrapper>
          <NewThreadPill active={active}>New </NewThreadPill>
        </ThreadActivityWrapper>
      );
    }

    return (
      <ThreadActivityWrapper>
        {!thread.watercooler && <LikeCount thread={thread} active={active} />}
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
