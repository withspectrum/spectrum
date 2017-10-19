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
  community: {
    name: string,
    slug: string,
    profilePhoto: string,
  },
  channel: {
    name: string,
    slug: string,
  },
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
        community,
        channel,
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
          </a>{' '}
          ·{' '}
          <a href={`https://spectrum.chat/${community.slug}`} target="_blank">
            {community.name}
          </a>{' '}
          ·{' '}
          <a
            href={`https://spectrum.chat/${community.slug}/${channel.slug}`}
            target="_blank"
          >
            {channel.name}
          </a>
        </ThreadListItemSubtitle>
      </StyledThreadListItem>
    );
  }
}

export default ThreadListItem;
