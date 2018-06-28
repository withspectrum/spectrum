// @flow
import * as React from 'react';
import { timeDifferenceShort } from 'shared/time-difference';
import { Timestamp, NewThreadTimestamp } from './style';
import type { HeaderProps } from './index';

class ThreadTimestamp extends React.Component<HeaderProps> {
  render() {
    const { thread, currentUser, active } = this.props;

    const now = new Date().getTime();
    const then = thread.lastActive || thread.createdAt;
    let timestamp = timeDifferenceShort(now, new Date(then).getTime());
    // show 'just now' instead of '0s' for new threads
    if (timestamp.slice(-1) === 's') {
      timestamp = 'Just now';
    }

    const createdAtTime = new Date(thread.createdAt).getTime();
    const createdWithinLastDay = now - createdAtTime < 86400;
    const isAuthor = currentUser && currentUser.id === thread.author.user.id;

    if (
      !isAuthor &&
      !thread.currentUserLastSeen &&
      createdWithinLastDay &&
      !active
    ) {
      return (
        <NewThreadTimestamp active={active}>New thread</NewThreadTimestamp>
      );
    }

    return <Timestamp active={active}>{timestamp}</Timestamp>;
  }
}

export default ThreadTimestamp;
