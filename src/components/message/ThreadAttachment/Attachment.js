// @flow
import React from 'react';
import type { Props } from './';
import { Loading } from 'src/components/loading';
import { Container, LinkWrapper, AvatarWrapper, Column } from './style';
import { changeActiveThread } from 'src/actions/dashboardFeed';
import ThreadHeader from 'src/views/dashboard/components/inboxThread/header/threadHeader';
import { ThreadTitle } from 'src/views/dashboard/components/inboxThread/style';
import { UserAvatar } from 'src/components/avatar';

class Attachment extends React.Component<Props> {
  render() {
    const { data } = this.props;
    const { thread, loading, error } = data;

    if (loading)
      return (
        <Container style={{ padding: '16px 12px' }}>
          <Loading />
        </Container>
      );
    if (error) return null;

    if (!thread) return null;

    return (
      <Container>
        <LinkWrapper
          onClick={e => e.stopPropagation()}
          to={{ search: `?thread=${thread.id}` }}
        />
        <AvatarWrapper>
          <UserAvatar user={thread.author.user} size={32} />
        </AvatarWrapper>
        <Column>
          <ThreadHeader thread={thread} />
          <ThreadTitle>{thread.content.title}</ThreadTitle>
        </Column>
      </Container>
    );
  }
}

export default Attachment;
