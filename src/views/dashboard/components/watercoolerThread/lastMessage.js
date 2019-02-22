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

    const isCurrentUser =
      currentUser && currentUser.id === thread.lastMessage.author.user.id;
    const name = isCurrentUser
      ? 'You: '
      : `${thread.lastMessage.author.user.name}: `;
    const snippet =
      thread.lastMessage.messageType === 'media'
        ? 'Shared a photo'
        : toPlainText(toState(JSON.parse(thread.lastMessage.content.body, 44)));

    return (
      <LastMessageWrapper active={active}>
        <UserAvatar
          showOnlineStatus={false}
          user={thread.lastMessage.author.user}
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
