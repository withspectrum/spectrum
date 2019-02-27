// @flow
import * as React from 'react';
import type { WatercoolerInfoType } from 'shared/graphql/fragments/thread/watercoolerInfo';
import { LastMessageWrapper } from './style';
import { sortByDate } from 'src/helpers/utils';
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
    if (
      !thread.messageConnection ||
      thread.messageConnection.edges.length === 0
    )
      return null;

    const lastMessage = sortByDate(
      thread.messageConnection.edges.map(({ node }) => node),
      'timestamp',
      'desc'
    )[0];

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
