// @flow
import * as React from 'react';
import type { WatercoolerInfoType } from 'shared/graphql/fragments/thread/watercoolerInfo';
import OnlineCount from './onlineCount';
import { ThreadActivityWrapper } from './style';

type Props = {
  thread: WatercoolerInfoType,
  active: boolean,
};

class ThreadActivity extends React.Component<Props> {
  render() {
    const { thread, active } = this.props;

    if (!thread) return null;

    return (
      <ThreadActivityWrapper>
        <OnlineCount thread={thread} active={active} />
      </ThreadActivityWrapper>
    );
  }
}

export default ThreadActivity;
