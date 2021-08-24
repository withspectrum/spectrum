// @flow
import * as React from 'react';
import { timeDifferenceShort } from 'shared/time-difference';
import { Timestamp } from './style';
import type { HeaderProps } from './index';

class ThreadTimestamp extends React.Component<HeaderProps> {
  render() {
    const { thread, active } = this.props;

    const now = new Date().getTime();
    const then = thread.lastActive || thread.createdAt;
    let timestamp = timeDifferenceShort(now, new Date(then).getTime());
    // show 'just now' instead of '0s' for new threads
    if (timestamp.slice(-1) === 's') {
      timestamp = 'Just now';
    }

    return (
      <React.Fragment>
        <Timestamp active={active}>{timestamp}</Timestamp>
      </React.Fragment>
    );
  }
}

export default ThreadTimestamp;
