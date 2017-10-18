import * as React from 'react';
import {
  StyledThreadListItem,
  ThreadListItemTitle,
  ThreadListItemSubtitle,
} from '../style';

type ThreadProps = {
  id: string,
  creator: {
    name: string,
    username: string,
  },
  content: {
    title: string,
  },
  createdAt: Date,
  messageCount: number,
};

type Props = {
  thread: ThreadProps,
};

class ThreadListItem extends React.Component<Props> {
  render() {
    const {
      thread: {
        id,
        creator: { name, username },
        content: { title },
        messageCount,
      },
    } = this.props;

    return (
      <StyledThreadListItem>
        <a href={`https://spectrum.chat/thread/${id}`} target="_blank">
          <ThreadListItemTitle>{title}</ThreadListItemTitle>
        </a>
        {messageCount > 0 && (
          <ThreadListItemSubtitle>
            {messageCount > 1 ? `${messageCount} messages` : `1 message`}
          </ThreadListItemSubtitle>
        )}
        <ThreadListItemSubtitle>
          By{' '}
          <a href={`https://spectrum.chat/users/${username}`} target="_blank">
            {name}
          </a>
        </ThreadListItemSubtitle>
      </StyledThreadListItem>
    );
  }
}

export default ThreadListItem;
