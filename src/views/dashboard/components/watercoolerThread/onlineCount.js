// @flow
import * as React from 'react';
import type { WatercoolerInfoType } from 'shared/graphql/fragments/thread/watercoolerInfo';
import Icon from 'src/components/icons';
import { OnlineCountWrapper, NewCount, OnlineDot } from './style';

type Props = {
  currentUser: ?Object,
  thread: WatercoolerInfoType,
  active: boolean,
};

class OnlineCount extends React.Component<Props> {
  render() {
    const { thread, active } = this.props;

    const online = thread.community.metaData.onlineMembers.toString();

    return (
      <OnlineCountWrapper
        active={active}
        tipText={`${online} members online`}
        tipLocation={'top-right'}
      >
        {thread.community.name} watercooler
        <OnlineDot />
        <span>{online} members online</span>
      </OnlineCountWrapper>
    );
  }
}

export default OnlineCount;
