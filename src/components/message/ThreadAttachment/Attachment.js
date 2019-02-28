// @flow
import React from 'react';
import type { Props } from './';
import compose from 'recompose/compose';
import { Loading } from 'src/components/loading';
import { Container, LinkWrapper, AvatarWrapper, Column } from './style';
import { changeActiveThread } from 'src/actions/dashboardFeed';
import ThreadHeader from 'src/views/dashboard/components/inboxThread/header/threadHeader';
import Activity from 'src/views/dashboard/components/inboxThread/activity';
import { ThreadTitle } from 'src/views/dashboard/components/inboxThread/style';
import { UserAvatar } from 'src/components/avatar';
import { withCurrentUser } from 'src/components/withCurrentUser';
import getThreadLink from 'src/helpers/get-thread-link';

class Attachment extends React.Component<Props> {
  render() {
    const { data, currentUser, message } = this.props;
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
          to={{ pathname: getThreadLink(thread), state: { modal: true } }}
        />
        {message.author.user.id !== thread.author.user.id && (
          <AvatarWrapper>
            <UserAvatar user={thread.author.user} size={32} />
          </AvatarWrapper>
        )}
        <Column>
          <ThreadHeader
            currentUser={currentUser}
            active={false}
            thread={thread}
          />
          <ThreadTitle>{thread.content.title}</ThreadTitle>
          <Activity currentUser={currentUser} thread={thread} active={false} />
        </Column>
      </Container>
    );
  }
}

export default compose(withCurrentUser)(Attachment);
