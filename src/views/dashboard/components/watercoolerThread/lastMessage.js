// @flow
import * as React from 'react';
import type { WatercoolerInfoType } from 'shared/graphql/fragments/thread/watercoolerInfo';
import { LastMessageWrapper } from './style';
import truncate from 'shared/truncate';
import { toPlainText, toState } from 'shared/draft-utils';
import { UserAvatar } from 'src/components/avatar';

type Props = {
  currentUser: ?Object,
  thread: WatercoolerInfoType,
  active: boolean,
};

class LastMessage extends React.Component<Props> {
  render() {
    const { thread, active, currentUser } = this.props;
    const lastEdge = thread.messageConnection.edges[0];
    if (!lastEdge) return null;
    const lastMessage = lastEdge.node;

    const isCurrentUser =
      currentUser && currentUser.id === lastMessage.author.user.id;
    const name = isCurrentUser ? 'You: ' : `${lastMessage.author.user.name}: `;
    const snippet =
      lastMessage.messageType === 'media'
        ? 'Shared a photo'
        : toPlainText(toState(JSON.parse(lastMessage.content.body)));

    return (
      <LastMessageWrapper active={active}>
        <UserAvatar
          showOnlineStatus={false}
          user={lastMessage.author.user}
          size={20}
        />
        <span style={{ marginLeft: '8px' }}>
          {name}
          {truncate(snippet, 80)}
        </span>
      </LastMessageWrapper>
    );
  }
}

export default LastMessage;
